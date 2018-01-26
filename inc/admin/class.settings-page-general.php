<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Class for Managing the General Settings Page
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @todo Add support for setting other google maps settings: bias_bounds, restrict_state, restrict_postcode, restrict_city, restrict_street, language
 * @todo Apply flush_rewrite_rules() after updating permalinks
 */
class Settings_Page_General extends Settings_Page {
	
	/**
	 * Returns the configuration array for the settings page
	 * 
	 * @return array
	 */
	public function getConfig() {
		return [
			'settings_name' => 'locsearch',
			'page' => [
				'id' => 'locations-search',
				'title' => 'Locations Search Settings',
				'hook' => '',
				'required_capability' => 'manage_options',
				'file' => 'settings-page.php',
			],
			'menu' => [
				'title' => 'Settings',
				'position' => 'edit.php?post_type=location',
				'icon' => 'dashicons-location',
			],
			'sections'=> [
				'general' => [
					'title' => 'General Settings',
					'fields' => [
						'google_api_key' => [
							'title' => 'Google API Key',
							'description' => '<a href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key" target="_blank">Create a Google Maps Javascript API key</a> and enter it here.',
							'is_required' => true,
						],
						'permalinks_base' => [
							'title' => 'Permalinks Base',
							'default' => 'locations',
							'description' => 'Text to be used as a base for creating the urls for each location, e.g: '.home_url( '/' ).'<strong>locations</strong>/location-name/',
							'sanitize_func' => 'sanitize_title',
							'is_required' => true,
						],
						'permalinks_category' => [
							'title' => 'Permalinks Base for Categories',
							'default' => 'category',
							'description' => 'Text to be used to create the urls for each category, e.g: '.home_url( '/' ).'locations/<strong>category</strong>/category-name/',
							'sanitize_func' => 'sanitize_title',
							'is_required' => true,
						],
					],
				],
				'maps' => [
					'title' => 'Maps Settings',
					'fields' => [
						'focus_country' => [
							'title' => 'Focus Country',
							'description' => 'If you want to focus the map search on a particular country, select it here.',
							'file' => 'settings-select-field.php',
						],
						'focus_strict' => [
							'title' => 'Focus Mode',
							'file' => 'settings-bool-field.php',
							'sanitize_func' => 'boolval',
							'description' => 'If you specified a "Focus Country": select <strong>bias</strong> to give it preference on the map results but still include results from other countries, or select <strong>restrict</strong> to only include map results from that country.',
							'bool_values' => ['Bias', 'Restrict'],
						],
						'search_radius' => [
							'title' => 'Search Radius',
							'type' => 'number',
							'sanitize_func' => 'absint',
							'description' => 'Default radius size of the area to include in search results (in kilometers)',
							'default' => 10,
						],
						'max_radius' => [
							'title' => 'Maximum Radius',
							'type' => 'number',
							'sanitize_func' => 'absint',
							'description' => 'Maximum radius size allowed for the search area',
							'default' => 50,
						],
						'map_styles' => [
							'title' => 'Map Styles',
							'description' => 'Use this <a href="https://mapstyle.withgoogle.com/" target="_blank">tool to generate custom map styles</a> and paste the JSON code here.',
							'file' => 'settings-textarea-field.php',
							'is_json' => true,
						],
						'map_marker' => [
							'title' => 'Map Markers',
							'description' => 'Select an image to be used to create the markers on the map.',
							'file' => 'settings-image-selector.php',
							'sanitize_func' => 'absint',
						],
						'map_marker_active' => [
							'title' => 'Active Marker',
							'description' => 'You can use a different image to represent active markers (when a user clicks on a specific location).',
							'file' => 'settings-image-selector.php',
							'sanitize_func' => 'absint',
						],
						'map_cluster' => [
							'title' => 'Map Clusters',
							'description' => 'Image to be used when creating clusters (if they are enabled).',
							'file' => 'settings-image-selector.php',
							'sanitize_func' => 'absint',
						],
					],
				],
			],
		];
	}
	
	/**
	 * Constructor function
	 * 
	 * @return void
	 */
	protected function __construct() {
		parent::__construct();
		add_filter( 'settings_page/select_options/focus_country', [$this, 'country_select_options'] );
		add_action( 'settings_page/updated', 'flush_rewrite_rules' );
	}
	
	/**
	 * Load assets necessary for the settings page
	 * 
	 * @param string $hook
	 * @return void
	 */
	public function load_assets( $hook ) {
		if( $this->page['hook'] === $hook ) {
			wp_enqueue_media();
			wp_enqueue_style(  NS\PLUGIN_NAME.'_edit-settings', NS\PLUGIN_URL.'assets/css/edit-settings.css', [], NS\PLUGIN_VERSION );
			wp_enqueue_script( NS\PLUGIN_NAME.'_edit-settings', NS\PLUGIN_URL.'assets/js/edit-settings.js', ['jquery'], NS\PLUGIN_VERSION );
		}
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
	
}
