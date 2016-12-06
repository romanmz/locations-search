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
		$url_slug = LocationsSearchSettings::get( 'permalinks_base' );
		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'menu_position'       => 20,
			'menu_icon'           => 'dashicons-location',
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'excerpt', 'revisions', ),
			'has_archive'         => $url_slug,
			'can_export'          => true,
			'delete_with_user'    => false,
			'capability_type'     => 'page',
			'rewrite'             => array(
				'slug'            => $url_slug,
			),
		);
		register_post_type( 'location', $args );
		
	}
	add_action( 'init', 'locationssearch_post_type_location' );
}

// Flush Rewrite Rules on plugin activation
if( !function_exists( 'locationssearch_flush_rewrites' ) ) {
	function locationssearch_flush_rewrites() {
		locationssearch_post_type_location();
		flush_rewrite_rules();
	}
}
register_activation_hook( LocationsSearch::get_main_file(), 'locationssearch_flush_rewrites' );
register_deactivation_hook( LocationsSearch::get_main_file(), 'flush_rewrite_rules' );



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
			<div class="lsedit__row">
				<?php $this->display_text( $post, 'address' ) ?>
				<?php $this->display_text( $post, 'suburb' ) ?>
			</div>
			<div class="lsedit__row">
				<?php $this->display_text( $post, 'postcode' ) ?>
				<?php $this->display_dropdown( $post, 'state' ) ?>
			</div>
			<div id="location_address__update">
				<button class="button">Update Map</button>
			</div>
			<div id="location_address__options"></div>
			<div class="lsedit__row">
				<?php $this->display_text( $post, 'lat' ) ?>
				<?php $this->display_text( $post, 'lng' ) ?>
			</div>
			<div id="location_address__map"></div>
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
				<div class="lsedit__column">
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
				<div class="lsedit__column">
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
			wp_enqueue_script( 'location-edit-google-maps-api', '//maps.googleapis.com/maps/api/js?key='.LocationsSearchSettings::get( 'google_api_key' ) );
			wp_enqueue_script( 'location-edit-screen', LocationsSearch::get_url().'/js/location-edit.js', array( 'location-edit-google-maps-api', 'jquery', ), LOCATIONSSEARCHVERSION );
			wp_enqueue_style( 'location-edit-screen', LocationsSearch::get_url().'/css/location-edit.css', array(), LOCATIONSSEARCHVERSION );
			
		}
		
		
	}
	new LocationsSearchAddressMetabox();
}



// META BOX: Location Details
// ==================================================

if( !class_exists( 'LocationsSearchDetailsMetabox' ) ) {
	class LocationsSearchDetailsMetabox {
		
		
		// Properties
		// ------------------------------
		private $post_type = 'location';
		private $box_name = 'Location Details';
		private $box_id = 'location_details';
		private $nonce_name = 'locations_details_nonce';
		private $nonce_action = 'save_metadata';
		private $meta_fields = array(
			'phone' => array(
				'label' => 'Phone Number',
			),
			'email' => array(
				'label' => 'Email',
			),
			'website' => array(
				'label' => 'Website',
			),
			'opening_hours' => array(
				'label' => 'Opening Hours',
			),
		);
		
		
		// Construct
		// ------------------------------
		public function __construct() {
			add_action( 'add_meta_boxes_'.$this->post_type, array( $this, 'register_metabox' ) );
			add_action( 'save_post', array( $this, 'save_post_meta' ) );
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
			<div class="lsedit__row lsedit__row--3cols">
				<?php $this->display_text( $post, 'phone' ) ?>
				<?php $this->display_text( $post, 'email' ) ?>
				<?php $this->display_text( $post, 'website' ) ?>
			</div>
			<div>
				<?php
				
				// Opening hours table
				$opening_hours = (array) get_post_meta( $post->ID, 'opening_hours', true );
				$days = array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', );
				?>
				<h2 class="lsedit__subheading">Opening Hours</h2>
				<table class="lsedit__openinghours">
					<thead>
						<tr>
							<th></th>
							<th>Opens</th>
							<th>Closes</th>
						</tr>
					</thead>
					<tbody>
						<?php
						for( $i=0; $i<7; $i++ ) {
							printf( '
								<tr>
									<td><label for="opening_hours_%1$s">%2$s</label></td>
									<td><input type="text" name="opening_hours[%1$s][0]" value="%3$s" id="opening_hours_%1$s"></td>
									<td><input type="text" name="opening_hours[%1$s][1]" value="%4$s"></td>
								</tr>',
								$i,
								$days[ $i ],
								isset( $opening_hours[ $i ][0] ) ? esc_attr( $opening_hours[ $i ][0] ) : '',
								isset( $opening_hours[ $i ][1] ) ? esc_attr( $opening_hours[ $i ][1] ) : ''
							);
						}
						?>
					</tbody>
				</table>	
			</div>
			<?php
			
		}
		
		
		// Display Metabox - Fields
		// ------------------------------
		public function display_text( $post, $meta_key ) {
			
			// Init vars
			$label = isset( $this->meta_fields[ $meta_key ]['label'] ) ? $this->meta_fields[ $meta_key ]['label'] : $meta_key;
			$meta_value = get_post_meta( $post->ID, $meta_key, true );
			
			// Variations for email and website fields
			$input_type = 'text';
			if( $meta_key == 'email' ) {
				$meta_value = is_email( $meta_value );
				$input_type = 'email';
			} elseif( $meta_key == 'website' ) {
				$meta_value = esc_url( $meta_value );
			}
			
			// Output
			printf( '
				<div class="lsedit__column">
					<div class="field-box %1$s_%2$s-box">
						<label for="%1$s_%2$s">%3$s</label>
						<input type="%5$s" id="%1$s_%2$s" name="%2$s" value="%4$s" size="25">
					</div>
				</div>',
				$this->box_id,
				$meta_key,
				$label,
				esc_attr( $meta_value ),
				$input_type
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
				
				// Get new value
				$new_value = isset( $_POST[ $meta_key ] ) ? $_POST[ $meta_key ] : '';
				
				// Sanitize data
				if( $meta_key == 'opening_hours' ) {
					if( !is_array( $new_value ) ) {
						$new_value = false;
					}
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
		
		
	}
	new LocationsSearchDetailsMetabox();
}
