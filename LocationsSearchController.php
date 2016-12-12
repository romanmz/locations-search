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
			add_action( 'wp_enqueue_scripts', array( get_class(), 'frontend_scripts' ) );
			add_shortcode( 'locations_search', array( get_class(), 'get_locations_search_shortcode' ) );
			add_action( 'wp_ajax_'.'lsajax_search_results', array( get_class(), 'lsajax_search_results' ) );
			add_action( 'wp_ajax_nopriv_'.'lsajax_search_results', array( get_class(), 'lsajax_search_results' ) );
		}
		
		
		// Frontend Scripts
		// ------------------------------
		static public function frontend_scripts() {
			wp_enqueue_script( 'locations-search-google-maps-api', '//maps.googleapis.com/maps/api/js?key='.LocationsSearchSettings::get( 'google_api_key' ) );
			wp_enqueue_script( 'locations-search-clusterer', LocationsSearch::get_url().'/vendor/marker-clusterer/markerclusterer.js', array(), LOCATIONSSEARCHVERSION );
			wp_enqueue_script( 'locations-search', LocationsSearch::get_url().'/js/locations-search.js', array( 'locations-search-google-maps-api', 'locations-search-clusterer', 'jquery', ), LOCATIONSSEARCHVERSION );
			wp_localize_script( 'locations-search', 'locations_search', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'ajax_action' => 'lsajax_search_results',
				'map_styles' => apply_filters( 'locations_search_map_styles', LocationsSearchSettings::get( 'map_styles' ) ),
				'focus_country' => LocationsSearchSettings::get( 'focus_country' ),
				'focus_country_strict' => LocationsSearchSettings::get( 'focus_country_strict' ),
				'text_did_you_mean' => 'Did you mean:',
				'text_0_results' => 'No results found',
				'text_1_result' => '1 result found',
				'text_more_results' => '# results found',
				'text_please_enter_address' => 'Please enter an address',
				'error_invalid_request' => 'Invalid request, please verify that the requested address is correct',
				'error_query_limit' => 'You have exceeded the maximum number of allowed queries, please wait for some time before trying again',
				'error_no_results' => 'No results found, please try a different address',
				'error_unknown' => 'There was an unknown error',
				'initial_lat' => -33.865,
				'initial_lng' => 151.2094,
				'text_current_location' => '(current location)',
				'map_marker_active' => apply_filters( 'locations_search_map_marker_active', LocationsSearchModel::get_marker_data( LocationsSearchSettings::get( 'map_marker_active' ) ) ),
				'map_cluster' => apply_filters( 'locations_search_map_cluster', array(
					'imagePath' => LocationsSearch::get_url().'/vendor/marker-clusterer/m',
					'maxZoom' => 13,
					'styles' => LocationsSearchModel::get_cluster_data(),
				) ),
			) );
			wp_enqueue_style( 'locations-search', LocationsSearch::get_url().'/css/locations-search.css', array(), LOCATIONSSEARCHVERSION );
		}
		
		
		// Shortcodes
		// ------------------------------
		static public function get_locations_search_shortcode( $atts=array(), $content='' ) {
			return LocationsSearchViews::get_container( $atts, $content );
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
