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
	 * Returns the configuration array for the meta box
	 * 
	 * @return array
	 */
	public function getConfig() {
		$settings = get_option( 'locsearch' );
		return [
			'post_type' => 'location',
			'metabox' => [
				'id' => 'location_address',
				'title' => 'Location Address',
				'context' => 'advanced',			// 'advanced'*|'normal'|'side'
				'priority' => 'default',			// 'default'*|'high'|'low'
				'file' => 'metabox-location-address.php',
			],
			'nonce' => [
				'name' => 'location_address_nonce',
				'action' => 'location_address_save_',
			],
			'fields' => [
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
					'file' => 'metabox-select-field.php',
					'default' => $settings['focus_country'],
				],
				'lat' => [
					'label' => 'Latitude',
					'sanitize' => 'floatval',
				],
				'lng' => [
					'label' => 'Longitude',
					'sanitize' => 'floatval',
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
		add_filter( 'meta_box/select_options/country', [$this, 'country_select_options'] );
	}
	
	/**
	 * Return the full list of countries
	 * 
	 * @param array $options
	 * @return array
	 */
	public function country_select_options( $options ) {
		$options = array_merge(
			['' => '- Select a country -'],
			NS\Common\Data_Countries::get_all_countries()
		);
		return $options;
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
		$settings = get_option( 'locsearch' );
		wp_enqueue_style( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/css/edit-screen.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key='.$settings['google_api_key'] );
		wp_enqueue_script( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/js/edit-screen.js', [NS\PLUGIN_NAME.'_google-maps-api', 'jquery'], NS\PLUGIN_VERSION );
	}
	
}
