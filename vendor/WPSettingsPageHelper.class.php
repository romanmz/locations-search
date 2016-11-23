<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// WPSettingsPageHelper v1.0
// ==================================================

if( !class_exists( 'WPSettingsPageHelper' ) ) {
	class WPSettingsPageHelper {
		
		
		// Properties
		// ------------------------------
		private $id;
		private $title;
		private $menu_title;
		private $capability;
		private $parent_id;
		private $option_name;
		private $option_group;
		private $options;
		private $sections = array();
		private $fields = array();
		
		
		// Setup page, sections and fields
		// ------------------------------
		public function __construct( $id, $title, $menu_title, $option_name, $capability='manage_options', $parent_id=false ) {
			
			// Store properties
			$this->id = esc_attr( $id );
			$this->title = esc_html( $title );
			$this->menu_title = esc_html( $menu_title );
			$this->capability = sanitize_title( $capability );
			$this->parent_id = esc_attr( $parent_id );
			$this->option_name = sanitize_title( $option_name );
			$this->option_group = $this->option_name;
			
			// Init option in database
			$this->options = get_option( $option_name );
			if( $this->options === false ) {
				$this->options = array();
				update_option( $this->option_name, $this->options );
			}
			
			// Trigger actions
			add_action( 'admin_menu', array( $this, 'init_admin_menu' ) );
			add_action( 'admin_init', array( $this, 'init_settings' ) );
		}
		public function add_section( $id, $title, $description='' ) {
			$section = new stdClass;
			$section->id = sanitize_title( $id );
			$section->title = esc_html( $title );
			$section->description = wp_kses_post( $description );
			$this->sections[ $section->id ] = $section;
		}
		public function add_field( $section_id, $id, $title, $display_function, $has_error_function=false, $sanitize_function=false ) {
			$field = new stdClass;
			$field->section_id = sanitize_title( $section_id );
			$field->id = sanitize_title( $id );
			$field->title = esc_html( $title );
			$field->display_function = $display_function;
			$field->has_error_function = $has_error_function;
			$field->sanitize_function = $sanitize_function;
			if( isset( $this->sections[ $field->section_id ] ) ) {
				$field->value = isset( $this->options[ $field->id ] ) ? $this->options[ $field->id ] : '';
				$this->fields[ $field->id ] = $field;
			}
		}
		
		
		// Init settings
		// ------------------------------
		public function init_admin_menu() {
			if( !$this->parent_id ) {
				add_menu_page(
					$this->title,
					$this->menu_title,
					$this->capability,
					$this->id,
					array( $this, 'display_page' )
					// menu icon
					// menu position
				);
			} else {
				add_submenu_page(
					$this->parent_id,
					$this->title,
					$this->menu_title,
					$this->capability,
					$this->id,
					array( $this, 'display_page' )
				);
			}
		}
		public function init_settings() {
			foreach( $this->sections as $section ) {
				add_settings_section(
					$section->id,
					$section->title,
					array( $this, 'display_section' ),
					$this->id
				);
			}
			foreach( $this->fields as $field ) {
				add_settings_field(
					$field->id,
					$field->title,
					is_callable( $field->display_function ) ? $field->display_function : '__return_false',
					$this->id,
					$field->section_id,
					array(
						'id' => $field->id,
						'label' => $field->title,
						'label_for' => $field->id,
						'name' => $this->option_name.'['.$field->id.']',
						'value' => $field->value,
					)
				);
			}
			register_setting(
				$this->option_group,
				$this->option_name,
				array( $this, 'sanitize_data' )
			);
		}
		
		
		// Display
		// ------------------------------
		public function display_page() {
			if( $this->parent_id !== 'options-general.php' ) {
				settings_errors( $this->option_group );
			}
			?>
			<div class="wrap">
				<h2><?php echo $this->title ?></h2>
				<form method="post" action="options.php">
					<?php
					settings_fields( $this->option_group );
					do_settings_sections( $this->id );
					submit_button();
					?>
				</form>
			</div>
			<?php
		}
		public function display_section( $section ) {
			echo $this->sections[ $section['id'] ]->description;
		}
		
		
		// Validate and sanitize
		// ------------------------------
		public function sanitize_data( $user_data ) {
			$clean_data = array();
			foreach( $this->fields as $field ) {
				
				// Get new value and validate
				$value = isset( $user_data[ $field->id ] ) ? $user_data[ $field->id ] : '';
				$has_error_function = is_callable( $field->has_error_function ) ? $field->has_error_function : '__return_false';
				$has_errors = call_user_func( $has_error_function, $value, $field->id, $field->title );
				if( $has_errors ) {
					
					// If validation failed, throw error and restore old value
					add_settings_error(
						$this->option_group,
						$field->id,
						'ERROR: '.$has_errors,
						'error'
					);
					$clean_data[ $field->id ] = $field->value;
				}
				
				// Sanitize new value
				else {
					$sanitize_function = is_callable( $field->sanitize_function ) ? $field->sanitize_function : 'sanitize_text_field';
					$clean_data[ $field->id ] = call_user_func( $sanitize_function, $value );
				}
			}
			return $clean_data;
		}
		
		
	}
}

/*
// HOW TO USE:

// 1. CREATE A NEW SETTINGS PAGE
$MyOptions = new WPSettingsPageHelper(
	'my_options',         // page id
	'My Options Page',    // page title
	'My Options',         // title of link in backend menu
	'foo_options',        // name that will be used in the database to store the options
	'edit_theme_options', // (optional, default:'manage_options' ) show the options page only to users with this capability
	'options-general.php' // (optional, default:false) if false, creates the page as top level item, if a string is passed, the new page will be added as a child of the page specified here
);

// 2. CREATE A SECTION
$MyOptions->add_section(
	'basics',             // section id
	'Basics',             // section title
	'Lorem ipsum&hellip;' // (optional) HTML content defined here will be displayed after the section's title
);

// 3. CREATE A FIELD
$MyOptions->add_field(
	'basics',                 // section id where the field will appear (section must have already been created)
	'full_name',              // field id
	'Full Name',              // field title
	'my_text_field_display',  // name of function that will generate the html for the field
	'my_text_field_validate', // (optional) name of function that will validate user input
	'my_text_field_sanitize'  // (optional, default:'sanitize_text_field') name of function that will sanitize user input before saving to the database
);

// 4. OUTPUT FIELD
function my_text_field_display( $data ) {
	// A $data array will be passed with useful info about the field to be displayed, including the current value in the database
	printf(
		'<input id="%s" type="text" name="%s" class="%s" value="%s">',
		$data['id'],
		$data['name'],
		'large-text',
		esc_attr( $data['value'] )
	);
}

// OPTIONAL: VALIDATE
function my_text_field_validate( $value, $field_id, $field_title ) {
	// 3 variables will be passed: the value to check, the field id and the field label
	// To throw a validation error, return a string with a description of the error
	// Or return false to confirm that there are no errors
	$value = trim( $value );
	if( empty( $value ) ) {
		return 'The field “'.$field_title.'” is required';
	}
	return false;
}

// OPTIONAL: SANITIZE
function my_text_field_sanitize( $value ) {
	// Only the value to sanitize is passed, you must return it, otherwise nothing will be saved
	return trim( esc_html( $value ) );
}
*/
