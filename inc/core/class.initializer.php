<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Core
 */

namespace Locations_Search\Core;
use Locations_Search as NS;

/**
 * Initializer Class
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
		
		// Add activation hooks
		register_activation_hook( NS\PLUGIN_FILE, [__CLASS__, 'on_activation'] );
		register_deactivation_hook( NS\PLUGIN_FILE, [__CLASS__, 'on_deactivation'] );
		
		// Add the rest of the hooks
		if( self::has_required_php_version() ) {
			add_action( 'plugins_loaded', [__CLASS__, 'load_text_domain'] );
			NS\Common\Initializer::run();
			if( is_admin() ) {
				NS\Admin\Initializer::run();
			} else {
				NS\Frontend\Initializer::run();
			}
		}
	}
	
	/**
	 * Checks if the current PHP version is supported by the plugin
	 * 
	 * @return bool
	 */
	static public function has_required_php_version() {
		return version_compare( PHP_VERSION, NS\REQUIRED_PHP_VERSION, '>=' );
	}
	
	/**
	 * Runs the necessary tasks for when the plugin is activated
	 * 
	 * @return void
	 */
	static public function on_activation() {
		// Deactivate and throw error if current PHP version is unsupported
		if( !self::has_required_php_version() ) {
			deactivate_plugins( plugin_basename( NS\PLUGIN_FILE ) );
			$error_message = esc_html__( 'This plugin requires a minimum PHP Version of %s.', 'locations-search' );
			wp_die( sprintf( $error_message, NS\REQUIRED_PHP_VERSION ) );
		}
		NS\Common\Custom_Post_Types::register_all();
		NS\Common\Custom_Taxonomies::register_all();
		flush_rewrite_rules();
	}
	
	/**
	 * Runs the necessary tasks for when the plugin is deactivated
	 * 
	 * @return void
	 */
	static public function on_deactivation() {
		NS\Common\Custom_Post_Types::unregister_all();
		NS\Common\Custom_Taxonomies::unregister_all();
		flush_rewrite_rules();
	}
	
	/**
	 * Loads the translation file for the current user locale
	 * 
	 * @return void
	 */
	static public function load_text_domain() {
		$rel_path = dirname( plugin_basename( NS\PLUGIN_FILE ) ).'/languages/';
		load_plugin_textdomain( NS\PLUGIN_TEXT_DOMAIN, false, $rel_path );
	}
	
}
