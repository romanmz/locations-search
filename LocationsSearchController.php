<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Controller
// ==================================================

if( !class_exists( 'LocationsSearchController' ) ) {
	class LocationsSearchController {
		
		
		// Init
		// ------------------------------
		static public function init() {
			add_action( 'wp_ajax_'.'lsajax_search_results', array( get_class(), 'lsajax_search_results' ) );
			add_action( 'wp_ajax_nopriv_'.'lsajax_search_results', array( get_class(), 'lsajax_search_results' ) );
		}
		
		
		// AJAX Calls
		// ------------------------------
		static public function lsajax_search_results() {
			$posts = LocationsSearchModel::get_closest_locations_from_array( $_POST );
			foreach( $posts as $i => $post ) {
				$_post = new stdClass;
				$_post->i = $post->i = $i;
				$_post->lat = $post->lat;
				$_post->lng = $post->lng;
				$_post->distance = $post->distance;
				$_post->distanceUnits = $post->distance_units;
				$_post->markerIconLabel = $post->markerIconLabel = apply_filters( 'locations_search_map_marker_label', '', $post );
				$_post->markerIconData = $post->markerIconData = apply_filters( 'locations_search_map_marker', LocationsSearchModel::get_marker_data(), $post );
				$_post->resultsItemHTML = $post->resultsItemHTML = LocationsSearchViews::get_results_html( $post );
				$_post->infoWindowHTML = $post->infoWindowHTML = LocationsSearchViews::get_info_window( $post );
				$posts[ $i ] = $_post;
			}
			header( 'Content-type: application/json' );
			echo json_encode( $posts );
			die();
		}
		
		
	}
	LocationsSearchController::init();
}
