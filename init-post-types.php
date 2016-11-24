<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// POST TYPE: Location
// ==================================================

if( !function_exists( 'locationssearch_post_type_location' ) ) {
	function locationssearch_post_type_location() {
		
		// Define Labels
		$labels = array(
			'name'                => 'Locations',
			'singular_name'       => 'Location',
			'name_admin_bar'      => 'Location',
			'menu_name'           => 'Locations',
			'all_items'           => 'All Locations',
			'add_new'             => 'Add New',
			'add_new_item'        => 'Add New Location',
			'edit_item'           => 'Edit Location',
			'view_item'           => 'View Location',
			'search_items'        => 'Search Locations',
			'not_found'           => 'No locations found',
			'not_found_in_trash'  => 'No locations found in Trash',
			'parent_item_colon'   => 'Parent Location:',
			'new_item'            => 'New Location',
		);
		
		// Register post type
		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'menu_position'       => 20,
			'menu_icon'           => 'dashicons-location',
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'excerpt', 'revisions', ),
			'has_archive'         => 'locations',
			'can_export'          => true,
			'delete_with_user'    => false,
			'capability_type'     => 'page',
			'rewrite'             => array(
				'slug'            => 'locations',
			),
		);
		register_post_type( 'location', $args );
		
	}
	add_action( 'init', 'locationssearch_post_type_location' );
}



// META BOX: Location Address
// ==================================================

if( !class_exists( 'LocationsSearchAddressMetabox' ) ) {
	class LocationsSearchAddressMetabox {
		
		
		// Properties
		// ------------------------------
		private $post_type = 'location';
		private $box_name = 'Location Address';
		private $box_id = 'location_address';
		private $nonce_name = 'locations_address_nonce';
		private $nonce_action = 'save_metadata';
		private $meta_fields = array(
			'address' => array(
				'label' => 'Address',
			),
			'suburb' => array(
				'label' => 'Suburb / City',
			),
			'postcode' => array(
				'label' => 'Postcode',
			),
			'state' => array(
				'label' => 'State / Territory',
				'options' => array( 'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA', ),
			),
			'country' => array(
				'label' => 'Country',
			),
			'lat' => array(
				'label' => 'Latitude',
				'sanitize' => 'floatval',
			),
			'lng' => array(
				'label' => 'Longitude',
				'sanitize' => 'floatval',
			),
		);
		
		
		// Construct
		// ------------------------------
		public function __construct() {
			add_action( 'add_meta_boxes_'.$this->post_type, array( $this, 'register_metabox' ) );
			add_action( 'save_post', array( $this, 'save_post_meta' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'load_assets' ) );
		}
		
		
		// Register Metabox
		// ------------------------------
		public function register_metabox() {
			add_meta_box(
				$this->box_id,
				$this->box_name,
				array( $this, 'display_metabox' ),
				$this->post_type,
				'normal',
				'default'
			);
		}
		
		
		// Display Metabox
		// ------------------------------
		public function display_metabox( $post ) {
			
			wp_nonce_field( $this->nonce_action, $this->nonce_name );
			?>
			<div class="location_address__row">
				<?php $this->display_text( $post, 'address' ) ?>
				<?php $this->display_text( $post, 'suburb' ) ?>
			</div>
			<div class="location_address__row">
				<?php $this->display_text( $post, 'postcode' ) ?>
				<?php $this->display_dropdown( $post, 'state' ) ?>
			</div>
			<div class="location_address__row">
				<?php $this->display_text( $post, 'lat' ) ?>
				<?php $this->display_text( $post, 'lng' ) ?>
			</div>
			<?php
			
		}
		
		
		// Display Metabox - Fields
		// ------------------------------
		public function display_text( $post, $meta_key ) {
			
			// Init vars
			$label = isset( $this->meta_fields[ $meta_key ]['label'] ) ? $this->meta_fields[ $meta_key ]['label'] : $meta_key;
			$meta_value = get_post_meta( $post->ID, $meta_key, true );
			
			// Output
			printf( '
				<div class="location_address__col">
					<div class="field-box %1$s_%2$s-box">
						<label for="%1$s_%2$s">%3$s</label>
						<input type="text" id="%1$s_%2$s" name="%2$s" value="%4$s" size="25">
					</div>
				</div>',
				$this->box_id,
				$meta_key,
				$label,
				esc_attr( $meta_value )
			);
			
		}
		public function display_dropdown( $post, $meta_key ) {
			
			// Init vars
			$label = isset( $this->meta_fields[ $meta_key ]['label'] ) ? $this->meta_fields[ $meta_key ]['label'] : $meta_key;
			$options = isset( $this->meta_fields[ $meta_key ]['options'] ) ? $this->meta_fields[ $meta_key ]['options'] : array();
			$meta_value = get_post_meta( $post->ID, $meta_key, true );
			
			// Output
			$options_html = '';
			foreach( $options as $option ) {
				$options_html .= sprintf(
					'<option value="%1$s" %2$s>%1$s</option>',
					$option,
					selected( $option, $meta_value, false )
				);
			}
			printf( '
				<div class="location_address__col">
					<div class="field-box %1$s_%2$s-box">
						<label for="%1$s_%2$s">%3$s</label>
						<select id="%1$s_%2$s" name="%2$s">
							%4$s
						</select>
					</div>
				</div>',
				$this->box_id,
				$meta_key,
				$label,
				$options_html
			);
			
		}
		
		
		// Save Post Meta
		// ------------------------------
		public function save_post_meta( $post_id ) {
			
			// Validate request
			if(
				( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ||
				!isset( $_POST[ $this->nonce_name ] ) ||
				!wp_verify_nonce( $_POST[ $this->nonce_name ], $this->nonce_action )
			) {
				return $post_id;
			}
			
			// Loop meta values
			foreach( $this->meta_fields as $meta_key => $field ) {
				
				// Get new value and sanitize it
				$new_value = isset( $_POST[ $meta_key ] ) ? $_POST[ $meta_key ] : '';
				if( isset( $field['sanitize'] ) && is_callable( $field['sanitize'] ) ) {
					$new_value = call_user_func( $field['sanitize'], $new_value );
				} else {
					$new_value = sanitize_text_field( $new_value );
				}
				
				// Update meta
				if( empty( $new_value ) ) {
					delete_post_meta( $post_id, $meta_key );
				} else {
					update_post_meta( $post_id, $meta_key, $new_value );
				}
			}
			
		}
		
		
		// Load css and js
		// ------------------------------
		public function load_assets( $hook ) {
			
			// Only on post edit screen
			if(
				!in_array( $hook, array( 'post.php', 'post-new.php' ) )
				|| get_post_type() != $this->post_type
			) {
				return;
			}
			
			// Load assets
			wp_enqueue_style( 'location-edit-screen', LocationsSearch::get_url().'/css/location-edit.css', array(), LOCATIONSSEARCHVERSION );
			
		}
		
		
	}
	new LocationsSearchAddressMetabox();
}
