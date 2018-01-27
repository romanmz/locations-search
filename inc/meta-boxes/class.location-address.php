<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Meta_Boxes
 */

namespace Locations_Search\Meta_Boxes;
use Locations_Search as NS;

/**
 * Class for Managing the Location Address Meta_Box
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Location_Address extends Meta_Box {
	
	/**
	 * Returns the configuration array for the meta box
	 * 
	 * @return array
	 */
	public function getConfig() {
		return [
			'post_type' => 'location',
			'meta_box' => [
				'id' => 'location_address',
				'title' => 'Location Address',
				'context' => 'advanced',			// 'advanced'*|'normal'|'side'
				'priority' => 'default',			// 'default'*|'high'|'low'
				'file' => 'meta-box-location-address.php',
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
					'file' => 'field-select.php',
					'default' => $this->settings->focus_country,
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
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * Instance constructor
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @return void
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
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
			NS\Data\Countries::get_all_countries()
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
		wp_enqueue_style( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/css/edit-screen.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key='.$this->settings->google_api_key );
		wp_enqueue_script( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/js/edit-screen.js', [NS\PLUGIN_NAME.'_google-maps-api', 'jquery'], NS\PLUGIN_VERSION );
	}
	
}
