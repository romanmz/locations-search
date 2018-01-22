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
 * @todo Support i18n
 */
class Metabox_Location_Details extends Metabox {
	
	/**
	 * @var Metabox_Location_Details
	 */
	static protected $instance = null;
	
	/**
	 * @var string|array The name of the post type(s) that should load this metabox
	 * @todo Test different types of screens (post_type|'link'|'comment'|admin_page|admin_menu|WP_Screen|array)
	 */
	public $post_type = 'location';
	
	/**
	 * @var array Meta box attributes
	 */
	public $metabox = [
		'id' => 'location_details',
		'title' => 'Location Details',
		'context' => 'advanced',			// 'advanced'*|'normal'|'side'
		'priority' => 'default',			// 'default'*|'high'|'low'
		'file' => 'metabox-location-details.php',
	];
	
	/**
	 * @var array Keys to generate and verify 'nonce' fields
	 */
	public $nonce = [
		'name' => 'location_details_nonce',
		'action' => 'location_details_save_',
	];
	
	/**
	 * @var array List of fields and their attributes
	 */
	public $fields = [
		'phone' => [
			'label' => 'Phone Number',
		],
		'email' => [
			'label' => 'Email',
			'type' => 'email',
		],
		'website' => [
			'label' => 'Website',
		],
		'opening_hours' => [
			'label' => 'Opening Hours',
		],
	];
	
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
