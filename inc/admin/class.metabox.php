<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin
 */

namespace Locations_Search\Admin;
use Locations_Search as NS;

/**
 * Helper Class for Creating Meta Boxes
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @todo Support i18n
 * @todo Support default values|type checks (e.g. arrays)
 */
abstract class Metabox {
	
	/**
	 * Returns the configuration array for the meta box
	 * 
	 * @return array
	 */
	abstract public function getConfig();
	
	/**
	 * @var string|array The name of the post type(s) that should load this metabox
	 * @todo Test different types of screens (post_type|'link'|'comment'|admin_page|admin_menu|WP_Screen|array)
	 */
	public $post_type = '';
	
	/**
	 * @var array Meta box attributes
	 */
	public $metabox = [];
	
	/**
	 * @var array Keys to generate and verify 'nonce' fields
	 */
	public $nonce = [];
	
	/**
	 * @var array List of fields and their attributes
	 */
	public $fields = [];
	
	/**
	 * Init function
	 * 
	 * @return Metabox
	 */
	static public function init() {
		static $instance = null;
		if( is_null( $instance ) ) {
			$instance = new static;
		}
		return $instance;
	}
	
	/**
	 * Instance constructor
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @return void
	 */
	protected function __constructor() {
		
		// Copy and process configuration
		$config = $this->getConfig();
		$this->post_type = $config['post_type'];
		$this->metabox = $config['metabox'];
		$this->nonce = $config['nonce'];
		$this->fields = $config['fields'];
		array_walk( $this->fields, [$this, 'prepare_field_data'] );
		
		// Runs hooks
		add_action( 'add_meta_boxes_'.$this->post_type, [$this, 'register_metabox'] );
		add_action( 'save_post', [$this, 'save_post_meta'] );
		add_action( 'admin_enqueue_scripts', [$this, 'load_assets'] );
	}
	
	/**
	 * Fill in default field attributes
	 * 
	 * @param string $name
	 * @param array $data
	 * @return array
	 */
	public function prepare_field_data( &$data, $name ) {
		$default_atts = [
			'label' => '',
			'id' => $this->metabox['id'].'_'.$name,
			'type' => 'text',
			'default' => '',
			'sanitize' => null,
			'escape_func' => null,
			'file' => 'metabox-text-field.php',
		];
		$data = wp_parse_args( $data, $default_atts );
		$data['name'] = $name;
		return $data;
	}
	
	/**
	 * Registers the new metabox
	 * 
	 * @return void
	 */
	public function register_metabox( $post ) {
		add_meta_box(
			$this->metabox['id'],
			$this->metabox['title'],
			[$this, 'render_metabox'],
			$this->post_type,
			$this->metabox['context'],
			$this->metabox['priority']
		);
	}
	
	/**
	 * Saves the user data into the database
	 * 
	 * @param int $post_id
	 * @return void
	 */
	public function save_post_meta( $post_id ) {
		
		// Validate request
		$nonce_action = $this->nonce['action'].$post_id;
		if(
			get_post_type( $post_id ) !== $this->post_type
			|| !isset( $_POST[ $this->nonce['name'] ] )
			|| !wp_verify_nonce( $_POST[ $this->nonce['name'] ], $nonce_action )
		) {
			return;
		}
		
		// Loop meta values
		foreach( $this->fields as $field_name => $field_data ) {
			
			// Get new value and sanitize it
			$new_value = isset( $_POST[ $field_name ] ) ? $_POST[ $field_name ] : '';
			$sanitize_func = is_callable( $field_data['sanitize'] ) ? $field_data['sanitize'] : 'sanitize_text_field';
			if( $field_name == 'opening_hours' ) {
				if( !is_array( $new_value ) ) {
					$new_value = false;
				} else {
					array_walk_recursive( $new_value, 'sanitize_text_field' );
				}
			} else {
				$new_value = call_user_func( $sanitize_func, $new_value );
			}
			
			// Update database
			if( empty( $new_value ) ) {
				delete_post_meta( $post_id, $field_name );
			} else {
				update_post_meta( $post_id, $field_name, $new_value );
			}
		}
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
	
	/**
	 * Outputs the HTML of the meta box
	 * 
	 * @param WP_Post $post
	 * @return void
	 */
	function render_metabox( $post ) {
		$nonce_action = $this->nonce['action'].$post->ID;
		wp_nonce_field( $nonce_action, $this->nonce['name'] );
		// Load template
		$file_path = trailingslashit(__DIR__).'views/'.$this->metabox['file'];
		if( is_file( $file_path ) && is_readable( $file_path ) ) {
			include( $file_path );
		}
	}
	
	/**
	 * Outputs the HTML of an individual meta box field
	 * 
	 * @param string $field_name
	 * @return void
	 */
	function render_field( $field_name ) {
		if( !isset( $this->fields[ $field_name ] ) ) {
			return;
		}
		global $post;
		$atts = $this->fields[ $field_name ];
		$atts['value'] = get_post_meta( $post->ID, $field_name, true );
		if( empty( $atts['value'] ) && !empty( $atts['default'] ) ) {
			$atts['value'] = $atts['default'];
		}
		
		// Escape values
		if( is_callable( $atts['escape_func'] ) ) {
			$atts['value'] = call_user_func( $atts['escape_func'], $atts['value'] );
		}
		
		// ! Default values
		if( $field_name == 'opening_hours' && !is_array( $atts['value'] ) ) {
			$atts['value'] = [];
		}
		
		// Load template
		$file_path = trailingslashit(__DIR__).'views/'.$atts['file'];
		if( is_file( $file_path ) && is_readable( $file_path ) ) {
			include( $file_path );
		}
	}
	
}
