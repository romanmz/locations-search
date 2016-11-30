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
			add_shortcode( 'locations_search', array( get_class(), 'get_locations_search_shortcode' ) );
		}
		
		
		// Shortcodes
		// ------------------------------
		static public function get_locations_search_shortcode( $atts=array(), $content='' ) {
			return LocationsSearchViews::get_container( $atts, $content );
		}
		
		
	}
	LocationsSearchController::init();
}
