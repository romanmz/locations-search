<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;
use Locations_Search\Admin\Settings_Page_General as Settings;

/**
 * Database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map_Model {
	
	/**
	 * Responds to AJAX with list of locations ordered and filtered by distance
	 * 
	 * @return void
	 */
	static public function ajax_closest_locations() {
		$locations = [];
		$lat = isset( $_POST['lat'] ) ? floatval( $_POST['lat'] ) : false;
		$lng = isset( $_POST['lng'] ) ? floatval( $_POST['lng'] ) : false;
		if( $lat !== false && $lng !== false ) {
			$search_radius = isset( $_POST['search_radius'] ) ? floatval( $_POST['search_radius'] ) : Settings::get( 'search_radius' );
			$locations = static::get_closest_locations( $lat, $lng, $search_radius );
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
	static public function get_closest_locations( $lat, $lng, $search_radius=0, $distance_units='km' ) {
		
		// Init vars
		global $wpdb;
		$lat = floatval( $lat );
		$lng = floatval( $lng );
		$search_radius = $search_radius ? floatval( $search_radius ) : Settings::get( 'search_radius' );
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
		$locations = array_map( [__CLASS__, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns a list of locations from the database
	 * 
	 * @param array $query_args
	 * @return array
	 */
	static public function get_locations( $query_args=[] ) {
		
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
		$locations = array_map( [__CLASS__, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns the location data for a particular post
	 * 
	 * @param int|array $data
	 * @return array
	 */
	static public function prepare_location_data( $data ) {
		
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
		$data['title'] = '';
		$data['url']   = get_permalink( $data['id'] );
		if( isset( $data['distance'] ) ) {
			$data['distance'] = floatval( $data['distance'] );
		}
		
		// Add marker images
		$data['images'] = [];
		if( Settings::get( 'map_marker' ) ) {
			$data['images']['marker'] = Search_Map_Helpers::get_marker_attributes( Settings::get( 'map_marker' ) );
		}
		if( Settings::get( 'map_marker_active' ) ) {
			$data['images']['marker_active'] = Search_Map_Helpers::get_marker_attributes( Settings::get( 'map_marker_active' ) );
		}
		
		// Add info window
		$info_window = sprintf( '
			<div class="locsearch_infowindow">
				<div class="locsearch_infowindow__title">%s</div>
				<div class="locsearch_infowindow__distance">%s</div>
				<div class="locsearch_infowindow__address">%s</div>
			</div>
			',
			esc_html( $data['title'] ),
			isset( $data['distance'] ) ? 'Distance: '.round( $data['distance'], 1 ).' '.$data['distance_units'] : '',
			static::get_formatted_address( $data['id'] )
		);
		$data['info_window'] = $info_window;
		
		// Return
		return $data;
	}
	
	/**
	 * Returns a nicely formatted address from a location
	 * 
	 * @param int $post_id
	 * @return string
	 */
	static public function get_formatted_address( $post_id ) {
		$meta_keys = ['address', 'address2', 'city', 'state', 'postcode', 'country'];
		foreach( $meta_keys as $meta_key ) {
			$$meta_key = trim( esc_html( get_post_meta( $post_id, $meta_key, true ) ) );
		}
		$address_line_1 = $address;
		$address_line_2 = $address2;
		$address_line_3 = implode( ', ', array_filter( [$city, $state, $postcode, $country] ) );
		$formatted_address = implode( '<br>', array_filter( [$address_line_1, $address_line_2, $address_line_3] ) );
		return $formatted_address;
	}
	
}
