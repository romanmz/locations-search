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
class Metabox_Location_Address {
	
	/**
	 * @var string|array The name of the post type(s) that should load this metabox
	 * @todo Test different types of screens (post_type|'link'|'comment'|admin_page|admin_menu|WP_Screen|array)
	 */
	static public $post_type = 'location';
	
	/**
	 * @var array Meta box attributes
	 */
	static public $metabox = [
		'id' => 'location_address',
		'title' => 'Location Address',
		'context' => 'advanced',			// 'advanced'*|'normal'|'side'
		'priority' => 'default',			// 'default'*|'high'|'low'
	];
	
	/**
	 * @var array Keys to generate and verify 'nonce' fields
	 */
	static public $nonce = [
		'name' => 'location_address_nonce',
		'action' => 'location_address_save_',
	];
	
	/**
	 * @var array List of fields and their attributes
	 */
	static public $fields = [
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
		],
		'lat' => [
			'label' => 'Latitude',
			'sanitize' => 'floatval',
		],
		'lng' => [
			'label' => 'Longitude',
			'sanitize' => 'floatval',
		],
	];
	
	/**
	 * Init function
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @return void
	 */
	static public function init() {
		foreach( self::$fields as $field_name => $field_data ) {
			self::$fields[ $field_name ] = self::prepare_field_data( $field_name, $field_data );
		}
		add_action( 'add_meta_boxes_'.self::$post_type, [__CLASS__, 'register_metabox'] );
		add_action( 'save_post', [__CLASS__, 'save_post_meta'] );
		add_action( 'admin_enqueue_scripts', [__CLASS__, 'load_assets'] );
	}
	
	/**
	 * Fill in default field attributes
	 * 
	 * @param string $field_name
	 * @param array $field_data
	 * @return array
	 */
	static public function prepare_field_data( $field_name, $field_data ) {
		$default_atts = [
			'label' => '',
			'id' => self::$metabox['id'].'_'.$field_name,
			'sanitize' => null,
		];
		$field_data = wp_parse_args( $field_data, $default_atts );
		$field_data['name'] = $field_name;
		return $field_data;
	}
	
	/**
	 * Registers the new metabox
	 * 
	 * @return void
	 */
	static public function register_metabox( $post ) {
		add_meta_box(
			self::$metabox['id'],
			self::$metabox['title'],
			[__CLASS__, 'render_metabox'],
			self::$post_type,
			self::$metabox['context'],
			self::$metabox['priority']
		);
	}
	
	/**
	 * Saves the user data into the database
	 * 
	 * @param int $post_id
	 * @return void
	 */
	static public function save_post_meta( $post_id ) {
		
		// Validate request
		$nonce_action = self::$nonce['action'].$post_id;
		if(
			get_post_type( $post_id ) !== self::$post_type
			|| !isset( $_POST[ self::$nonce['name'] ] )
			|| !wp_verify_nonce( $_POST[ self::$nonce['name'] ], $nonce_action )
		) {
			return;
		}
		
		// Loop meta values
		foreach( self::$fields as $field_name => $field_data ) {
			
			// Get new value and sanitize it
			$new_value = isset( $_POST[ $field_name ] ) ? $_POST[ $field_name ] : '';
			$sanitize_func = is_callable( $field_data['sanitize'] ) ? $field_data['sanitize'] : 'sanitize_text_field';
			$new_value = call_user_func( $sanitize_func, $new_value );
			
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
	static public function load_assets( $hook ) {
		
		// Load only on the necessary screens
		if(
			!in_array( $hook, ['post.php', 'post-new.php'] )
			|| get_post_type() != self::$post_type
		) {
			return;
		}
		
		// Load assets
		wp_enqueue_style( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/css/edit-screen.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key=' );
		wp_enqueue_script( NS\PLUGIN_NAME.'_edit-screen', NS\PLUGIN_URL.'assets/js/edit-screen.js', [NS\PLUGIN_NAME.'_google-maps-api', 'jquery'], NS\PLUGIN_VERSION );
	}
	
	/**
	 * Outputs the HTML of the meta box
	 * 
	 * @param WP_Post $post
	 * @return void
	 */
	static function render_metabox( $post ) {
		$nonce_action = self::$nonce['action'].$post->ID;
		wp_nonce_field( $nonce_action, self::$nonce['name'] );
		include( 'views/metabox-location-address.php' );
	}
	
	/**
	 * Outputs the HTML of an individual meta box field
	 * 
	 * @param string $field_name
	 * @return void
	 */
	static function render_field( $field_name ) {
		if( !isset( self::$fields[ $field_name ] ) ) {
			return;
		}
		global $post;
		$atts = self::$fields[ $field_name ];
		$atts['value'] = get_post_meta( $post->ID, $field_name, true );
		include( 'views/metabox-text-field.php' );
	}
	
}
