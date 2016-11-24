<?php
/*
Plugin Name: Locations Search
Plugin URI:
Description: Create and search locations by keyword, postcode and categories
Author: Roman Martinez
Author URI: http://romanmartinez.me/
Version: 0.1.1
*/

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );
define( 'LOCATIONSSEARCHVERSION', '0.1.0' );

// Load vendor scripts
require_once 'vendor/WPSettingsPageHelper.class.php';

// Define static class
if( !class_exists( 'LocationsSearch' ) ) {
	class LocationsSearch {
		static public function get_url() {
			return plugins_url( '', __FILE__ );
		}
		static public function get_path() {
			return dirname( __FILE__ );
		}
	}
}

// Load includes
require_once 'init-post-types.php';
