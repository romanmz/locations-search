<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// SETTINGS
// ==================================================

if( !class_exists( 'LocationsSearchSettings' ) ) {
	class LocationsSearchSettings {
		
		
		// Static Properties
		// ------------------------------
		static private $option;
		static private $option_name = 'locations_search';
		static private $option_group = 'locations_search_settings';
		static private $page_id = 'settings';
		static private $section_id = 'general';
		
		
		// Static Getter
		// ------------------------------
		static public function get( $field_key ) {
			
			// Load field value
			if( is_null( self::$option ) ) {
				self::$option = get_option( self::$option_name );
			}
			$field_value = isset( self::$option[ $field_key ] ) ? self::$option[ $field_key ] : '';
			
			// Fallback values
			if( $field_key == 'permalinks_name' && empty( $field_value ) ) {
				$field_value = 'locations';
			}
			if( $field_key == 'bias_country' && empty( $field_value ) ) {
				$field_value = 'us';
			}
			// $bias_bounds;
			// $restrict_state;
			// $restrict_postcode;
			// $restrict_suburb;
			// $restrict_street;
			// $language
			
			// Return
			return $field_value;
		}
		
		
		// Init
		// ------------------------------
		public function __construct() {
			add_action( 'admin_menu', array( $this, 'register_page' ) );
			add_action( 'admin_init', array( $this, 'register_section' ) );
			add_action( 'admin_init', array( $this, 'register_fields' ) );
			add_action( 'admin_init', array( $this, 'register_settings' ) );
		}
		
		
		// Register Page
		// ------------------------------
		public function register_page() {
			add_submenu_page(
				'edit.php?post_type=location',
				'Locations Search Settings',
				'Settings',
				'manage_options',
				self::$page_id,
				array( $this, 'display_page' )
			);
		}
		public function display_page() {
			if( !empty( $_GET['settings-updated'] ) ) {
				flush_rewrite_rules();
			}
			settings_errors( self::$option_group );
			?>
			<div class="wrap">
				<h2>Locations Search Settings</h2>
				<form method="post" action="options.php">
					<?php
					settings_fields( self::$option_group );
					do_settings_sections( self::$page_id );
					submit_button();
					?>
				</form>
			</div>
			<?php
		}
		
		
		// Register Section
		// ------------------------------
		public function register_section() {
			add_settings_section(
				self::$section_id,
				'',
				array( $this, 'display_section' ),
				self::$page_id
			);
		}
		public function display_section() {
		}
		
		
		// Register Fields
		// ------------------------------
		public function register_fields() {
			$fields = array(
				'google_api_key' => 'Google API Key',
				'permalinks_name' => 'Permalinks Name',
				'bias_country' => 'Map Region',
				'restrict_country' => 'Limit Results',
			);
			foreach( $fields as $field_key => $field_label ) {
				add_settings_field(
					$field_key,
					$field_label,
					array( $this, 'display_fields' ),
					self::$page_id,
					self::$section_id,
					array(
						'key' => $field_key,
						'label' => $field_label,
						'id' => self::$option_name.'_'.$field_key,
						'label_for' => self::$option_name.'_'.$field_key,
						'name' => self::$option_name.'['.$field_key.']',
						'value' => self::get( $field_key ),
					)
				);
			}
		}
		public function display_fields( $field ) {
			extract( $field );
			
			// Prepare country dropdowns
			if( $key == 'bias_country' || $key == 'restrict_country' ) {
				$country_html ='';
				$country_codes = LocationsSearch::get_country_codes();
				foreach( $country_codes as $country_code => $country_name ) {
					$country_html .= sprintf(
						'<option value="%s"%s>%s</option>',
						$country_code,
						selected( $value, $country_code, false ),
						$country_name
					);
				}
			}
			
			// Output fields
			switch( $field['key'] ) {
				case 'google_api_key':
					printf( '
						<input id="%s" type="text" name="%s" class="large-text" value="%s">
						<p class="description">Create a <a href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key" target="_blank">Google API Key</a> and paste it here (please enable both the <strong>Google Maps JavaScript API</strong> and the <strong>Google Maps Geocoding API</strong>).</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						esc_attr( $value )
					);
					break;
				case 'permalinks_name':
					printf( '
						<input id="%s" type="text" name="%s" class="regular-text" value="%s">
						<p class="description">Text to be used to create the urls for each location, e.g: '.home_url( '/' ).'<strong>locations</strong>/location_name/</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						esc_attr( $value )
					);
					break;
				case 'bias_country':
					printf( '
						<select id="%s" name="%s">
							%s
						</select>
						<p class="description">Bias the results towards the country selected here</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						$country_html
					);
					break;
				case 'restrict_country':
					printf( '
						<select id="%s" name="%s">
							<option value="">- Select a country -</option>
							%s
						</select>
						<p class="description">Limit the search results to only the country selected here (optional)</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						$country_html
					);
					break;
			}
		}
		
		
		// Register Settings
		// ------------------------------
		public function register_settings() {
			register_setting(
				self::$option_group,
				self::$option_name,
				array( $this, 'sanitize_data' )
			);
		}
		public function sanitize_data( $user_data ) {
			
			// White list
			$defaults = array(
				'google_api_key' => '',
				'permalinks_name' => '',
				'bias_country' => '',
				'restrict_country' => '',
			);
			$data = shortcode_atts( $defaults, $user_data );
			
			// Validation errors
			if( empty( $data['google_api_key'] ) ) {
				add_settings_error(
					self::$option_group,
					'google_api_key',
					'ERROR: The Google API Key is required for the locations search feature',
					'error'
				);
				$data['google_api_key'] = '';
			}
			
			// Sanitize
			$data['google_api_key'] = sanitize_text_field( $data['google_api_key'] );
			$data['permalinks_name'] = sanitize_title( $data['permalinks_name'] );
			$data['bias_country'] = sanitize_title( $data['bias_country'] );
			$data['restrict_country'] = sanitize_title( $data['restrict_country'] );
			
			// Save
			return $data;
		}
		
		
	}
	new LocationsSearchSettings();
}
