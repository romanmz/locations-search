<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;

/**
 * Frontend Initializer Class
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
		Search_Map::init();
	}
	
}
