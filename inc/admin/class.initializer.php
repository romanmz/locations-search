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
		Metabox_Location_Address::init();
	}
	
}
