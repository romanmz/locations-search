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
			
			// Get posts
			$posts = $wpdb->get_results( $query );
			$posts = !empty( $posts ) ? $posts : array();
			
			// Cast vars
			foreach( $posts as $post ) {
				$post->lat = floatval( $post->lat );
				$post->lng = floatval( $post->lng );
				$post->distance = floatval( $post->distance );
			}
			return $posts;
			
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
		
		
		// Get Marker Data from Attachment
		// ------------------------------
		static public function get_marker_data( $attachment_id=false ) {
			
			// Check attachment_id
			if( $attachment_id === false ) {
				$attachment_id = LocationsSearchSettings::get( 'map_marker' );
			}
			$attachment_id = absint( $attachment_id );
			
			// Get data
			$attachment_data = wp_get_attachment_image_src( $attachment_id, 'medium' );
			if( empty( $attachment_data ) ) {
				return false;
			}
			
			// Prepare data
			$url = $attachment_data[0];
			$width = $scaledWidth = $attachment_data[1];
			$height = $scaledHeight = $attachment_data[2];
			if( $scaledWidth > 40 ) {
				$ratio = 40 / $scaledWidth;
				$scaledWidth = 40;
				$scaledHeight = round( $scaledHeight * $ratio );
			}
			if( $scaledHeight > 40 ) {
				$ratio = 40 / $scaledHeight;
				$scaledHeight = 40;
				$scaledWidth = round( $scaledWidth * $ratio );
			}
			
			// Return data
			$marker = array(
				'url' => $url,
				'size' => array( $width, $height, ),
				'scaledSize' => array( $scaledWidth, $scaledHeight, ),
				'origin' => array( 0, 0, ),
				'anchor' => array( round( $scaledWidth / 2 ), $scaledHeight ),
				'labelOrigin' => array( round( $scaledWidth / 2 ), ( $scaledHeight * .4 ) ),
			);
			return $marker;
			
		}
		
		
	}
}