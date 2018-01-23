<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;

/**
 * Database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map_Model {
	
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
		$posts = get_posts( $query_args );
		$posts = array_map( [__CLASS__, 'extract_location_data'], $posts );
		return $posts;
	}
	
	/**
	 * Returns the location data for a particular post
	 * 
	 * @param int $post_id
	 * @return array
	 */
	static public function extract_location_data( $post_id ) {
		$data = [
			'id'    => $post_id,
			'title' => get_the_title( $post_id ),
			'url'   => get_permalink( $post_id ),
			'lat'   => floatVal( get_post_meta( $post_id, 'lat', true ) ),
			'lng'   => floatVal( get_post_meta( $post_id, 'lng', true ) ),
		];
		return $data;
	}
	
}
