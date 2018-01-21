<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );


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
