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
	 * @var array Keeps a list of dependencies
	 */
	private $deps = [];
	
	/**
	 * Runs the initializer functions and hooks
	 * 
	 * @return void
	 */
	public function __construct() {
		
		// Add activation hooks
		register_activation_hook( NS\PLUGIN_FILE, [$this, 'on_activation'] );
		register_deactivation_hook( NS\PLUGIN_FILE, [$this, 'on_deactivation'] );
		
		// Add the rest of the hooks
		if( $this->has_required_php_version() ) {
			add_action( 'plugins_loaded', [$this, 'load_text_domain'] );
			add_action( 'wp_enqueue_scripts', [$this, 'load_frontend_assets'] );
			$this->deps['settings'] = new NS\Settings\General();
			$this->deps['taxonomies'] = new NS\Core\Taxonomies( $this->deps['settings'] );
			$this->deps['post_types'] = new NS\Core\Post_Types( $this->deps['settings'] );
			$this->deps['metabox_address'] = new NS\Meta_Boxes\Location_Address( $this->deps['settings'] );
			$this->deps['metabox_details'] = new NS\Meta_Boxes\Location_Details( $this->deps['settings'] );
			$this->deps['shortcode_map'] = new NS\Shortcodes\Search_Map( $this->deps['settings'] );
		}
	}
	
	/**
	 * Checks if the current PHP version is supported by the plugin
	 * 
	 * @return bool
	 */
	public function has_required_php_version() {
		return version_compare( PHP_VERSION, NS\REQUIRED_PHP_VERSION, '>=' );
	}
	
	/**
	 * Runs the necessary tasks for when the plugin is activated
	 * 
	 * @return void
	 */
	public function on_activation() {
		// Deactivate and throw error if current PHP version is unsupported
		if( !$this->has_required_php_version() ) {
			deactivate_plugins( plugin_basename( NS\PLUGIN_FILE ) );
			$error_message = esc_html__( 'This plugin requires a minimum PHP Version of %s.', 'locations-search' );
			wp_die( sprintf( $error_message, NS\REQUIRED_PHP_VERSION ) );
		}
		$this->deps['taxonomies']->register_all();
		$this->deps['post_types']->register_all();
		flush_rewrite_rules();
	}
	
	/**
	 * Runs the necessary tasks for when the plugin is deactivated
	 * 
	 * @return void
	 */
	public function on_deactivation() {
		$this->deps['taxonomies']->unregister_all();
		$this->deps['post_types']->unregister_all();
		flush_rewrite_rules();
	}
	
	/**
	 * Loads the translation file for the current user locale
	 * 
	 * @return void
	 */
	public function load_text_domain() {
		$rel_path = dirname( plugin_basename( NS\PLUGIN_FILE ) ).'/languages/';
		load_plugin_textdomain( NS\PLUGIN_TEXT_DOMAIN, false, $rel_path );
	}
	
	/**
	 * Loads the required assets for the frontend
	 * 
	 * @return void
	 */
	public function load_frontend_assets() {
		wp_enqueue_style( NS\PLUGIN_NAME.'_frontend', NS\PLUGIN_URL.'assets/css/frontend.css', [], NS\PLUGIN_VERSION );
	}
	
}
