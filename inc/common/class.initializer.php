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
	 * @var bool Indicates whether or not the plugin has already been initialized
	 */
	static private $initalized = false;
	
	/**
	 * Runs the initializer functions and hooks
	 * 
	 * @return void
	 */
	static public function run() {
		
		// Initialize only once
		if( self::$initalized ) {
			return;
		}
		self::$initalized = true;
		
		// Run functions and add hooks
		Custom_Post_Types::init();
		Custom_Taxonomies::init();
	}
	
}
