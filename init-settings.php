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
			if( $field_key == 'permalinks_base' && empty( $field_value ) ) {
				$field_value = 'locations';
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
				'permalinks_base' => 'Permalinks Base',
				'focus_country' => 'Focus Country',
				'focus_country_strict' => 'Focus Country Mode',
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
			if( $key == 'focus_country' ) {
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
						<p class="description"><a href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key" target="_blank">Generate a Google Maps Javascript API key</a> and enter it here.</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						esc_attr( $value )
					);
					break;
				case 'permalinks_base':
					printf( '
						<input id="%s" type="text" name="%s" class="regular-text" value="%s">
						<p class="description">Text to be used as a base for creating the urls for each location, e.g: '.home_url( '/' ).'<strong>locations</strong>/location-name/</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						esc_attr( $value )
					);
					break;
				case 'focus_country':
					printf( '
						<select id="%s" name="%s">
							<option value="">- Select a country -</option>
							%s
						</select>
						<p class="description">If you want to focus the map on a single country, select it here.</p>
						',
						esc_attr( $id ),
						esc_attr( $name ),
						$country_html
					);
					break;
				case 'focus_country_strict':
					printf( '
						<label>
							<input type="radio" name="%1$s" value=""%2$s>
							Bias
						</label>
						&nbsp;
						<label>
							<input type="radio" name="%1$s" value="1"%3$s>
							Restrict
						</label>
						<p class="description">Select <strong>bias</strong> to give preference to the Focus Country on the map but still allow other countries to be displayed, or select <strong>restrict</strong> to strictly restrict the map only on the Focus Country.</p>
						',
						esc_attr( $name ),
						checked( false, $value, false ),
						checked( true, $value, false )
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
				'permalinks_base' => '',
				'focus_country' => '',
				'focus_country_strict' => '',
			);
			$data = shortcode_atts( $defaults, $user_data );
			
			// Validation errors
			if( empty( $data['google_api_key'] ) ) {
				add_settings_error(
					self::$option_group,
					'google_api_key',
					'It’s recommended to enter a Google Maps Javascript API key',
					'notice-info'
				);
			}
			
			// Success message
			add_settings_error(
				self::$option_group,
				'settings_updated',
				'Settings updated',
				'updated'
			);
			
			// Sanitize
			$data['google_api_key'] = sanitize_text_field( $data['google_api_key'] );
			$data['permalinks_base'] = sanitize_title( $data['permalinks_base'] );
			$data['focus_country'] = sanitize_title( $data['focus_country'] );
			$data['focus_country_strict'] = (bool) $data['focus_country_strict'];
			
			// Save
			return $data;
		}
		
		
	}
	new LocationsSearchSettings();
}
