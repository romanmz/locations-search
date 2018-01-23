<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Admin Initializer Class
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Initializer {
	
	/**
	 * Runs the initializer functions and hooks
	 * 
	 * @return void
	 */
	static public function run() {
		
		// Initialize only once
		static $initalized = false;
		if( $initalized ) {
			return;
		}
		$initalized = true;
		
		// Run functions and add hooks
		Settings_Page_General::init();
		Metabox_Location_Address::init();
		Metabox_Location_Details::init();
	}
	
}
