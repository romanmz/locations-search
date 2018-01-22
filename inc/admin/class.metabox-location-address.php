<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Class for Managing the Location Address Metabox
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @todo Support i18n
 */
class Metabox_Location_Address extends Metabox {
	
	/**
	 * @var string|array The name of the post type(s) that should load this metabox
	 * @todo Test different types of screens (post_type|'link'|'comment'|admin_page|admin_menu|WP_Screen|array)
	 */
	static public $post_type = 'location';
	
	/**
	 * @var array Meta box attributes
	 */
	static public $metabox = [
		'id' => 'location_address',
		'title' => 'Location Address',
		'context' => 'advanced',			// 'advanced'*|'normal'|'side'
		'priority' => 'default',			// 'default'*|'high'|'low'
		'file' => 'metabox-location-address.php',
	];
	
	/**
	 * @var array Keys to generate and verify 'nonce' fields
	 */
	static public $nonce = [
		'name' => 'location_address_nonce',
		'action' => 'location_address_save_',
	];
	
	/**
	 * @var array List of fields and their attributes
	 */
	static public $fields = [
		'address' => [
			'label' => 'Address',
		],
		'address2' => [
			'label' => 'Address (line 2)',
		],
		'city' => [
			'label' => 'City/Suburb',
		],
		'postcode' => [
			'label' => 'Postcode',
		],
		'state' => [
			'label' => 'State/Territory',
		],
		'country' => [
			'label' => 'Country',
		],
		'lat' => [
			'label' => 'Latitude',
			'sanitize' => 'floatval',
		],
		'lng' => [
			'label' => 'Longitude',
			'sanitize' => 'floatval',
		],
	];
	
	/**
	 * Load the necessary assets for the meta boxes
	 * 
	 * @param string $hook
	 * @return void
	 */
	static public function load_assets( $hook ) {
		
		// Load only on the necessary screens
		if(
			!in_array( $hook, ['post.php', 'post-new.php'] )
			|| get_post_type() != self::$post_type
		) {
			return;
		}
		
		// Load assets
		wp_enqueue_style( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/css/edit-screen.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key=' );
		wp_enqueue_script( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/js/edit-screen.js', [NS\PLUGIN_NAME.'_google-maps-api', 'jquery'], NS\PLUGIN_VERSION );
	}
	
}
