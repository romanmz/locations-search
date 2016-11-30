<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Model
// ==================================================

if( !class_exists( 'LocationsSearchModel' ) ) {
	class LocationsSearchModel {
		
		
		// Get Closest Locations
		// ------------------------------
		static public function get_closest_locations( $lat, $lng, $max_distance=0, $distance_units='km' ) {
			
			// Init vars
			global $wpdb;
			$lat = floatval( $lat );
			$lng = floatval( $lng );
			$max_distance = $max_distance ? floatval( $max_distance ) : 9999999;
			$distance_units = ( $distance_units == 'miles' ) ? 'miles' : 'km';
			$distance_factor = ( $distance_units == 'miles' ) ? 3959 : 6371;
			
			// Prepare query
			$query = "
				SELECT DISTINCT
					posts.*,
					latitude.meta_value as lat,
					longitude.meta_value as lng,
					'${distance_units}' as distance_units,
					(
						ACOS(
							SIN( RADIANS( $lat ) )
							* SIN( RADIANS( latitude.meta_value ) )
							+ COS( RADIANS( $lat ) )
							* COS( RADIANS( latitude.meta_value ) )
							* COS( RADIANS( $lng - longitude.meta_value ) )
						)
						* $distance_factor
					) AS distance
				FROM
					{$wpdb->prefix}postmeta AS latitude
					LEFT JOIN {$wpdb->prefix}postmeta as longitude ON latitude.post_id = longitude.post_id
					LEFT JOIN {$wpdb->prefix}posts as posts ON latitude.post_id = posts.ID
				WHERE
					latitude.meta_key = 'lat'
					AND longitude.meta_key = 'lng'
				HAVING
					distance < $max_distance
				ORDER BY
					distance ASC
			";
			
			// Get posts and return result
			$posts = $wpdb->get_results( $query );
			return !empty( $posts ) ? $posts : array();
			
		}
		static public function get_closest_locations_from_array( $atts=array() ) {
			$defaults = array(
				'lat' => 0,
				'lng' => 0,
				'distance' => 0,
				'distance_units' => '',
			);
			extract( shortcode_atts( $defaults, $atts ) );
			return self::get_closest_locations( $lat, $lng, $distance, $distance_units );
		}
		
		
	}
}
