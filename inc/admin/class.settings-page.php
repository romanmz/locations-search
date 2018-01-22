<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Helper Class for Creating Settings Pages
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @todo Add a 'prepare_page_data' method
 * @todo Define settings from within a method to allow applying filters and functions to them
 * @todo i18n
 */
class Settings_Page {
	
	/**
	 * @var array General page attributes
	 */
	public $page = [];
	
	/**
	 * @var array General menu attributes
	 */
	public $menu = [];
	
	/**
	 * @var array General database option attributes
	 */
	public $option = [];
	
	/**
	 * @var array List of sections and fields, and their attributes
	 */
	public $config = [];
	
	/**
	 * @var array Processed list of section attributes
	 */
	public $sections = [];
	
	/**
	 * @var array Processed list of field attributes
	 */
	public $fields = [];
	
	/**
	 * Retrieve the single instance of the current class
	 * 
	 * @return Settings_Page
	 */
	static public function getInstance() {
		static $instance = null;
		if( is_null( $instance ) ) {
			$instance = new static;
		}
		return $instance;
	}
	
	/**
	 * Init function (static)
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @return Settings_Page
	 */
	static public function init() {
		static::getInstance()->initialize();
		return static::getInstance();
	}
	
	/**
	 * Init function (instance)
	 * 
	 * Loads the data stored in the database, and adds the required actions and filters
	 * 
	 * @return void
	 */
	protected function initialize() {
		$this->option['data'] = get_option( $this->option['name'] );
		foreach( $this->config as $section_slug => $section_data ) {
			$this->sections[ $section_slug ] = $this->prepare_section_data( $section_slug, $section_data );
			foreach( $section_data['fields'] as $field_slug => $field_data ) {
				$this->fields[ $field_slug ] = $this->prepare_field_data( $field_slug, $field_data );
			}
		}
		add_action( 'admin_menu', [$this, 'register_page'] );
		add_action( 'admin_init', [$this, 'register_settings'] );
		add_action( 'admin_enqueue_scripts', [$this, 'load_assets'] );
	}
	
	/**
	 * Fill in default settings for sections
	 * 
	 * @param string $section_slug
	 * @param array $section_data
	 * @return array
	 */
	public function prepare_section_data( $section_slug, $section_data ) {
		$default_values = [
			'slug'        => $section_slug,
			'id'          => "section-{$section_slug}",
			'title'       => '',
			'description' => '',
			'fields'      => [],
			'file'        => 'settings-section.php',
		];
		$section_data = wp_parse_args( $section_data, $default_values );
		$section_data['fields'] = array_keys( $section_data['fields'] );
		return $section_data;
	}
	
	/**
	 * Fill in default settings for fields
	 * 
	 * @param string $field_slug
	 * @param array $field_data
	 * @return array
	 */
	public function prepare_field_data( $field_slug, $field_data ) {
		$default_values = [
			'slug'          => $field_slug,
			'id'            => "field-{$field_slug}",
			'type'          => 'text',
			'title'         => '',
			'description'   => '',
			'class'         => "field-{$field_slug}",
			'name'          => "{$this->option['name']}[{$field_slug}]",
			'default'       => '',
			'sanitize_func' => null,
			'file'          => 'settings-text-field.php',
		];
		$field_data = wp_parse_args( $field_data, $default_values );
		$field_data['label_for'] = $field_data['id'];
		$field_data['value'] = isset( $this->option['data'][ $field_slug ] ) ? $this->option['data'][ $field_slug ] : $field_data['default'];
		return $field_data;
	}
	
	/**
	 * Get all registered fields and their default values
	 * 
	 * Returns a simple associative array with keys for each registered field and their respective default values
	 * 
	 * @return array
	 */
	public function get_default_values() {
		$default_values = [];
		foreach( $this->fields as $field_slug => $field_data ) {
			$default_values[ $field_slug ] = $field_data['default'];
		}
		return $default_values;
	}
	
	/**
	 * Get all registered fields with updated and sanitized data
	 * 
	 * Also registers validation errors
	 * 
	 * @param array $new_values
	 * @return array
	 */
	public function get_sanitized_values( $new_values ) {
		$sanitized_values = [];
		foreach( $this->fields as $field_slug => $field_data ) {
			$new_value = isset( $new_values[ $field_slug ] ) ? $new_values[ $field_slug ] : '';
			
			// Sanitize
			$sanitize_func = is_callable( $field_data['sanitize_func'] ) ? $field_data['sanitize_func'] : 'sanitize_text_field';
			$new_value = call_user_func( $sanitize_func, $new_value );
			
			// Validate required
			if( !empty( $field_data['is_required'] ) && empty( $new_value ) ) {
				add_settings_error(
					$this->option['name'],
					$field_slug,
					isset( $field_data['is_required_message'] ) ? esc_html( $field_data['is_required_message'] ) : "The field {$field_data['title']} is required",
					isset( $field_data['is_required_type'] ) ? $field_data['is_required_type'] : 'error'
				);
				$new_value = $field_data['default']; // empty / previous / default / sanitized?
			}
			
			// Validate JSON
			if( !empty( $field_data['is_json'] ) ) {
				$json_test = json_decode( $new_value );
				if( json_last_error() !== JSON_ERROR_NONE ) {
					add_settings_error(
						$this->option['name'],
						$field_slug,
						"The field {$field_data['title']} must have a valid JSON format",
						'error'
					);
					$new_value = '';
				}
			}
			
			// Add to results array
			$sanitized_values[ $field_slug ] = $new_value;
			
		}
		return $sanitized_values;
	}
	
	/**
	 * Register the settings page
	 * 
	 * @return void
	 */
	public function register_page() {
		if( is_string( $this->menu['position'] ) ) {
			$this->page['hook'] = add_submenu_page(
				$this->menu['position'],
				$this->page['title'],
				$this->menu['title'],
				$this->page['required_capability'],
				$this->page['id'],
				[$this, 'render_page']
			);
		} else {
			$this->page['hook'] = add_menu_page(
				$this->page['title'],
				$this->menu['title'],
				$this->page['required_capability'],
				$this->page['id'],
				[$this, 'render_page'],
				$this->menu['icon'],
				$this->menu['position']
			);
		}
	}
	
	/**
	 * Register the settings, sections and fields
	 * 
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			$this->page['id'],
			$this->option['name'],
			[
				'sanitize_callback' => [$this, 'get_sanitized_values'],
				'default' => $this->get_default_values(),					// available until after the 'admin_init' hook
			]
		);
		foreach( $this->sections as $section_slug => $section_data ) {
			add_settings_section(
				$section_slug,
				$section_data['title'],
				[$this, 'render_section'],
				$this->page['id']
			);
			foreach( $section_data['fields'] as $field_slug ) {
				$field_data = $this->fields[ $field_slug ];
				add_settings_field(
					$field_slug,
					$field_data['title'],
					[$this, 'render_field'],
					$this->page['id'],
					$section_slug,
					$field_data
				);
			}
		}
	}
	
	/**
	 * Load assets necessary for the settings page
	 * 
	 * @param string $hook
	 * @return void
	 */
	public function load_assets( $hook ) {
		if( $this->page['hook'] === $hook ) {
		}
	}
	
	/**
	 * Output the HTML of the settings page
	 * 
	 * @return void
	 */
	public function render_page() {
		if( !current_user_can( $this->page['required_capability'] ) ) {
			return;
		}
		if( isset( $_GET['settings-updated'] ) ) {
			add_settings_error( $this->option['name'], 'settings-saved', 'Settings saved.', 'updated' );
		}
		if( $this->menu['position'] !== 'options-general.php' ) {
			settings_errors( $this->option['name'] );
		}
		// Load template
		$file_path = trailingslashit(__DIR__).'views/'.$this->page['file'];
		if( is_file( $file_path ) && is_readable( $file_path ) ) {
			include( $file_path );
		}
	}
	
	/**
	 * Outputs the HTML of each section
	 * 
	 * @param array $atts
	 * @return void
	 */
	public function render_section( $atts ) {
		// $atts['id']
		// $atts['title']
		// $atts['callback']
		$atts = $this->sections[ $atts['id'] ];
		// Load template
		$file_path = trailingslashit(__DIR__).'views/'.$atts['file'];
		if( is_file( $file_path ) && is_readable( $file_path ) ) {
			include( $file_path );
		}
	}
	
	/**
	 * Outputs the HTML of each input field
	 * 
	 * @param array $atts
	 * @return void
	 */
	public function render_field( $atts ) {
		// Load template
		$file_path = trailingslashit(__DIR__).'views/'.$atts['file'];
		if( is_file( $file_path ) && is_readable( $file_path ) ) {
			include( $file_path );
		}
	}
	
}
