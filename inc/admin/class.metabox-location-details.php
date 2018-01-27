<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Class for Managing the Location Details Metabox
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Metabox_Location_Details extends Metabox {
	
	/**
	 * Returns the configuration array for the meta box
	 * 
	 * @return array
	 */
	public function getConfig() {
		return [
			'post_type' => 'location',
			'metabox' => [
				'id' => 'location_details',
				'title' => 'Location Details',
				'context' => 'advanced',			// 'advanced'*|'normal'|'side'
				'priority' => 'default',			// 'default'*|'high'|'low'
				'file' => 'metabox-location-details.php',
			],
			'nonce' => [
				'name' => 'location_details_nonce',
				'action' => 'location_details_save_',
			],
			'fields' => [
				'phone' => [
					'label' => 'Phone Number',
				],
				'email' => [
					'label' => 'Email',
					'type' => 'email',
					'escape_func' => 'is_email',
				],
				'website' => [
					'label' => 'Website',
					'escape_func' => 'esc_url',
				],
				'opening_hours' => [
					'label' => 'Opening Hours',
					'file' => 'metabox-opening-hours.php',
				],
			],
		];
	}
	
	/**
	 * Instance constructor
	 * 
	 * @return void
	 */
	public function __construct() {
		parent::__constructor();
	}
	
	/**
	 * Load the necessary assets for the meta boxes
	 * 
	 * @param string $hook
	 * @return void
	 */
	public function load_assets( $hook ) {
		
		// Load only on the necessary screens
		if(
			!in_array( $hook, ['post.php', 'post-new.php'] )
			|| get_post_type() != $this->post_type
		) {
			return;
		}
		
		// Load assets
		wp_enqueue_style( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/css/edit-screen.css', [], NS\PLUGIN_VERSION );
	}
	
}
