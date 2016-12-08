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

// Define constants and static class
define( 'LOCATIONSSEARCHVERSION', '0.1.0' );
if( !class_exists( 'LocationsSearch' ) ) {
	class LocationsSearch {
		static public function get_url() {
			return plugins_url( '', __FILE__ );
		}
		static public function get_path() {
			return dirname( __FILE__ );
		}
		static public function get_main_file() {
			return __FILE__;
		}
	}
}

// Load includes
require_once 'LocationsSearchGeneric.php';
require_once 'init-post-types.php';
require_once 'init-settings.php';
require_once 'LocationsSearchModel.php';
require_once 'views.php';
require_once 'LocationsSearchController.php';
