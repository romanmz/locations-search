<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Model
// ==================================================

if( !class_exists( 'LocationsSearchModel' ) ) {
	class LocationsSearchModel {
		
		
		// Get Closest Locations from Array
		// ------------------------------
		static public function get_closest_locations_from_array( $atts=array() ) {
			
			// Init vars
			$defaults = array(
				'lat' => 0,
				'lng' => 0,
				'distance' => 0,
				'distance_units' => '',
				'query_type' => '',
				'query_values' => '',
				'state' => '',
				'lcategory' => false,
			);
			extract( shortcode_atts( $defaults, $atts ) );
			$filters = array();
			$posts = NULL;
			
			// Filter: state
			if( !empty( $state ) ) {
				$filters['meta_query'] = array();
				$filters['meta_query'][] = array(
					'key' => 'state',
					'value' => $state,
					'compare' => '=',
				);
			}
			
			// Filter: location category
			if( !empty( $lcategory ) ) {
				$filters['tax_query'] = array();
				$filters['tax_query'][] = array(
					'taxonomy' => 'location_category',
					'field' => 'term_id',
					'terms' => $lcategory,
					'operator' => 'AND',
				);
			}
			
			// Search by distance
			if( $lat && $lng && $distance ) {
				$posts = self::get_closest_ids( $lat, $lng, $distance, $distance_units );
			}
			
			// Include queried areas
			if( in_array( $query_type, array( 'suburb', 'state', 'postcode', 'country', ) ) && is_array( $query_values ) ) {
				if( is_null( $posts ) ) {
					$posts = array();
				}
				$posts = array_merge( $posts, get_posts( array(
					'post_type' => 'location',
					'post_status' => 'publish',
					'posts_per_page' => -1,
					'post__not_in' => array_map( function($post){return $post->ID;}, $posts ),
					'meta_query' => array(
						array(
							'key' => $query_type,
							'value' => array_unique( $query_values ),
							'compare' => 'IN',
						),
					),
					'orderby' => array( 'title' => 'ASC' ),
				) ) );
			}
			
			// Use filters
			if( !empty( $filters ) ) {
				
				// To reduce existing selection
				if( !is_null( $posts ) && !empty( $posts ) ) {
					$filters['post_type'] = 'location';
					$filters['post_status'] = 'publish';
					$filters['posts_per_page'] = -1;
					$filters['post__in'] = array_map( function($post){return $post->ID;}, $posts );
					$filters['orderby'] = 'post__in';
					$filters['fields'] = 'ids';
					$filtered_ids = get_posts( $filters );
					foreach( $posts as $i => $post ) {
						if( !in_array( $post->ID, $filtered_ids ) ) {
							unset( $posts[ $i ] );
						}
					}
					$posts = array_values( $posts );
				}
				
				// or to create a stand-alone query
				elseif( is_null( $posts ) ) {
					$filters['post_type'] = 'location';
					$filters['post_status'] = 'publish';
					$filters['posts_per_page'] = -1;
					$filters['orderby'] = array( 'title' => 'ASC' );
					$posts = get_posts( $filters );
				}
				
			}
			
			// Cast vars
			foreach( $posts as $post ) {
				$post->lat = floatval( $post->lat );
				$post->lng = floatval( $post->lng );
				$post->distance = floatval( $post->distance );
			}
			
			// Return
			return $posts;
		}
		
		
	}
}
