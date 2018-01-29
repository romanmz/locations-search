<?php
/**
 * Class for managing database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Data
 */

namespace Locations_Search\Data;
use Locations_Search as NS;

/**
 * Database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Locations {
	
	/**
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * Constructor function
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @return void
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
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
		$data['url']   = get_permalink( $data['id'] );
		if( isset( $data['distance'] ) ) {
			$data['distance'] = floatval( $data['distance'] );
		}
		
		// Return
		return $data;
	}
	
}
