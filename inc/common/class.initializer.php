<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Common
 */

namespace Locations_Search\Common;
use Locations_Search as NS;

/**
 * Common Initializer Class
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
		Custom_Post_Types::init();
		Custom_Taxonomies::init();
	}
	
}
