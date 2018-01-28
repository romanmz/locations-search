<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Shortcodes
 */

namespace Locations_Search\Shortcodes;
use Locations_Search as NS;

/**
 * Database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map_Model {
	
	/**
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * @var Locations_Search\Shortcodes\Search_Map_Helpers Holds a reference to the shortcode helpers
	 */
	protected $helpers;
	
	/**
	 * Constructor function
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @param Locations_Search\Settings\Search_Map_Helpers $helpers
	 * @return void
	 */
	public function __construct( $settings, $helpers ) {
		$this->settings = $settings;
		$this->helpers = $helpers;
	}
	
	/**
	 * Responds to AJAX with list of locations ordered and filtered by distance
	 * 
	 * @return void
	 */
	public function ajax_closest_locations() {
		$locations = [];
		$lat = isset( $_POST['lat'] ) ? floatval( $_POST['lat'] ) : false;
		$lng = isset( $_POST['lng'] ) ? floatval( $_POST['lng'] ) : false;
		if( $lat !== false && $lng !== false ) {
			$search_radius = isset( $_POST['search_radius'] ) ? floatval( $_POST['search_radius'] ) : $this->settings->search_radius;
			$locations = $this->get_closest_locations( $lat, $lng, $search_radius );
		}
		wp_send_json( $locations );
	}
	
	/**
	 * Returns a list of locations ordered by proximity to the requested coordinates
	 * 
	 * @param float $lat
	 * @param float $lng
	 * @param float $search_radius
	 * @param string $distance_units
	 * @return array
	 */
	public function get_closest_locations( $lat, $lng, $search_radius=0, $distance_units='km' ) {
		
		// Init vars
		global $wpdb;
		$lat = floatval( $lat );
		$lng = floatval( $lng );
		$search_radius = $search_radius ? floatval( $search_radius ) : $this->settings->search_radius;
		$distance_units = ( $distance_units == 'miles' ) ? 'miles' : 'km';
		$distance_factor = ( $distance_units == 'miles' ) ? 3959 : 6371;
		
		// Prepare query
		$query = "
			SELECT DISTINCT
				posts.ID as id,
				latitude.meta_value as lat,
				longitude.meta_value as lng,
				'{$distance_units}' as distance_units,
				(
					ACOS(
						SIN( RADIANS( {$lat} ) )
						* SIN( RADIANS( latitude.meta_value ) )
						+ COS( RADIANS( {$lat} ) )
						* COS( RADIANS( latitude.meta_value ) )
						* COS( RADIANS( {$lng} - longitude.meta_value ) )
					)
					* {$distance_factor}
				) as distance
			FROM
				{$wpdb->prefix}posts as posts
				LEFT JOIN {$wpdb->prefix}postmeta as latitude ON latitude.post_id = posts.ID
				LEFT JOIN {$wpdb->prefix}postmeta as longitude ON longitude.post_id = posts.ID
			WHERE
				posts.post_type = 'location'
				AND posts.post_status = 'publish'
				AND latitude.meta_key = 'lat'
				AND longitude.meta_key = 'lng'
			HAVING
				distance < {$search_radius}
			ORDER BY
				distance ASC
		";
		
		// Get posts and return location data
		$post_ids = $wpdb->get_results( $query, ARRAY_A );
		$locations = array_map( [$this, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns a list of locations from the database
	 * 
	 * @param array $query_args
	 * @return array
	 */
	public function get_locations( $query_args=[] ) {
		
		// Prepare query
		$default_args = [
			'post_type'           => 'location',
			'posts_per_page'      => -1,
			'post__in'            => '',
			'ignore_sticky_posts' => true,
			'fields'              => 'ids',
		];
		$query_args = wp_parse_args( $query_args, $default_args );
		
		// Get posts and return location data
		$post_ids = get_posts( $query_args );
		$locations = array_map( [$this, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns the location data for a particular post
	 * 
	 * @param int|array $data
	 * @return array
	 */
	public function prepare_location_data( $data ) {
		
		// Prepare basic information
		if( !is_array( $data ) ) {
			$data = [
				'id'    => $data,
				'lat'   => get_post_meta( $data, 'lat', true ),
				'lng'   => get_post_meta( $data, 'lng', true ),
			];
		}
		$data['id']    = absint( $data['id'] );
		$data['lat']   = floatval( $data['lat'] );
		$data['lng']   = floatval( $data['lng'] );
		$data['title'] = get_the_title( $data['id'] );
		$data['marker_label'] = '';
		$data['url']   = get_permalink( $data['id'] );
		if( isset( $data['distance'] ) ) {
			$data['distance'] = floatval( $data['distance'] );
		}
		
		// Add marker images
		$data['images'] = [];
		if( $this->settings->map_marker ) {
			$data['images']['marker'] = $this->helpers->get_marker_attributes( $this->settings->map_marker );
		}
		if( $this->settings->map_marker_active ) {
			$data['images']['marker_active'] = $this->helpers->get_marker_attributes( $this->settings->map_marker_active );
		}
		
		// Add info window
		$info_window = sprintf( '
			<div class="locsearch_infowindow">
				<div class="locsearch_title">%s</div>
				%s
			</div>
			',
			esc_html( $data['title'] ),
			isset( $data['distance'] ) ? format_location_distance( $data['distance'], $data['distance_units'] ) : ''
		);
		$data['info_window'] = $info_window;
		
		// Add list items
		$list_item = sprintf(
			'<li class="locsearch_box__result">
				<div class="locsearch_title">%s</div>
				%s
				%s
				%s
				%s
			</li>',
			esc_html( $data['title'] ),
			isset( $data['distance'] ) ? format_location_distance( $data['distance'], $data['distance_units'] ) : '',
			get_location_address( $data['id'] ),
			get_location_details( $data['id'] ),
			get_location_hours( $data['id'] )
		);
		$data['list_item'] = wp_kses_post( $list_item );
		
		// Return
		return $data;
	}
	
}
