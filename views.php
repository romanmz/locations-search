<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Views
// ==================================================

if( !class_exists( 'LocationsSearchViews' ) ) {
	class LocationsSearchViews {
		
		
		// Get Full Container
		// ------------------------------
		static public function get_container( $custom_atts=array(), $content='' ) {
			$html = sprintf( '
				<div class="lsform__container">
					%s
					<div class="lsform__options"></div>
					<div class="lsform__summary"></div>
					<noscript><div class="lsform__summary"><p>You need to enable javascript to be able to use this form.</p></div></noscript>
					<div class="lsform__results"></div>
					<div class="lsform__map"></div>
				</div>
				',
				self::get_search_form( $custom_atts )
			);
			return $html;
		}
		
		
		
		// Search Form
		// ==================================================
		
		
		// Get Search Form
		// ------------------------------
		static public function get_search_form( $custom_atts=array() ) {
			
			// Parse settings
			$default_atts = array(
				'action' => is_singular() ? get_permalink() : '',
				'method' => 'get',
				'distance' => '5,10,25,50,100',
				'distance_units' => 'km',
			);
			extract( shortcode_atts( $default_atts, $custom_atts ) );
			
			// Enable auto-search
			if(
				!empty( $_POST['ls_autosearch'] )
				&& !empty( $_SERVER['HTTP_REFERER'] )
				&& strpos( $_SERVER['HTTP_REFERER'], home_url() ) === 0
			) {
				$autoload = true;
			} else {
				$autoload = false;
			}
			
			// Output form
			$html = sprintf( '
				<form class="lsform" action="%s" method="%s"%s>
					%s
					%s
					<div class="lsform__submit">
						<button id="lsform__submit" type="submit">Search</button>
					</div>
				</form>',
				esc_url( $action ),
				( strtolower( $method ) == 'post' ) ? 'post' : 'get',
				$autoload ? ' data-lsautosearch="1"' : '',
				self::get_query_field(),
				self::get_distance_field( $distance, $distance_units )
			);
			return $html;
			
		}
		
		
		// Get "Query" Field
		// ------------------------------
		static private function get_query_field() {
			
			// Get requested query
			$query = !empty( $_REQUEST['query'] ) ? trim( $_REQUEST['query'] ) : '';
			
			// Output field
			$html = sprintf( '
				<div class="lsform__field lsform__query">
					<label for="lsform__query">%s</label>
					<input id="lsform__query" type="text" name="query" value="%s" title="%s" placeholder="%s">
				</div>',
				esc_html( 'Query' ),
				esc_attr( $query ),
				esc_attr( 'Query' ),
				esc_attr( 'Enter your postcode or city' )
			);
			return $html;
			
		}
		
		
		// Get "Distance" Field
		// ------------------------------
		static private function get_distance_field( $options, $units=false ) {
			
			// Clean up options
			$options = (string) $options;
			$options = array_filter( explode( ',', $options ), 'floatval' );
			if( empty( $options ) ) {
				$options = array( 25 );
			}
			$units = in_array( $units, array( 'miles', 'km', 'select', ) ) ? $units : 'km';
			
			// Get requested options
			$selected = !empty( $_REQUEST['distance'] ) ? floatval( $_REQUEST['distance'] ) : 0;
			if( !$selected || !in_array( $selected, $options ) ) {
				$selected = reset( $options );
			}
			$selected_units = !empty( $_REQUEST['distance_units'] ) ? trim( $_REQUEST['distance_units'] ) : 'km';
			
			// One option
			if( count( $options ) == 1 ) {
				$distance_html = sprintf(
					'<input id="lsform__distance" type="hidden" name="distance" value="%s">',
					esc_attr( $selected )
				);
			}
			
			// Multiple options
			else {
				$options_html = '';
				foreach( $options as $option ) {
					$options_html .= sprintf(
						'<option value="%1$s"%2$s>%1$s%3$s</option>',
						$option,
						selected( $option, $selected, false ),
						( $units == 'select' ) ? '' : ' '.$units
					);
				}
				$distance_html = sprintf( '
					<label for="lsform__distance">%s</label>
					<select id="lsform__distance" name="distance" title="%s">
						%s
					</select>
					',
					esc_html( 'Distance' ),
					esc_attr( 'Distance' ),
					$options_html
				);
			}
			
			// Pre-defined units
			if( $units != 'select' ) {
				$units_html = sprintf(
					'<input id="lsform__distanceunits" type="hidden" name="distance_units" value="%s">',
					$units
				);
			}
			
			// Allow units selection
			else {
				$units_html = sprintf(
					'
					<label for="lsform__distanceunits">%s</label>
					<select id="lsform__distanceunits" name="distance_units" title="%s">
						<option value="km"%s>km</option>
						<option value="miles"%s>miles</option>
					</select>',
					esc_html( 'Units' ),
					esc_attr( 'Units' ),
					selected( $selected_units, 'km', false ),
					selected( $selected_units, 'miles', false )
				);
			}
			
			// Wrap up fields
			if( count( $options ) > 1 && $units == 'select' ) {
				$distance_html = '<div class="lsform__subfield">'.$distance_html.'</div>';
				$units_html = '<div class="lsform__subfield">'.$units_html.'</div>';
			}
			$html = $distance_html.$units_html;
			if( count( $options ) > 1 || $units == 'select' ) {
				$html = '<div class="lsform__field lsform__distance">'.$html.'</div>';
			}
			
			// Return
			return $html;
			
		}
		
		
		
		// Search Results
		// ==================================================
		
		
		// Get Results HTML
		// ------------------------------
		static public function get_results_html( $post ) {
			$details = self::get_formatted_details( $post );
			$hours = self::get_formatted_hours_list( $post );
			$html = sprintf( '
				<h3 class="lsform__result__heading">%s</h3>
				<div class="lsform__result__distance">Distance: %s %s</div>
				<address class="lsform__result__address"><p>%s</p></address>
				%s
				%s
				<div class="lsform__result__links"><a href="%s">More info</a> | <a href="%s" target="_blank">Get directions</a></div>
				',
				get_the_title( $post ),
				round( $post->distance, 1 ),
				$post->distance_units,
				self::get_formatted_address( $post ),
				$details ? '<p class="lsform__result__details">'.$details.'</p>' : '',
				$hours ? '<p class="lsform__result__hours">'.$hours.'</p>' : '',
				get_permalink( $post ),
				'https://maps.google.com/maps?'.http_build_query( array( 'saddr'=>'Current Location', 'daddr'=>$post->lat.','.$post->lng ) )
			);
			return apply_filters( 'locations_search_results_html', $html, $post );
		}
		
		
		
		// Helper Functions
		// ==================================================
		
		static public function get_formatted_address( $post ) {
			$meta_keys = array( 'address', 'suburb', 'state', 'postcode', );
			foreach( $meta_keys as $meta_key ) {
				$$meta_key = trim( esc_html( get_post_meta( $post->ID, $meta_key, true ) ) );
			}
			$address_line_1 = $address;
			$address_line_2 = trim( "{$suburb} {$state} {$postcode}" );
			$formatted_address = implode( '<br>', array_filter( array( $address_line_1, $address_line_2, ) ) );
			return $formatted_address;
		}
		
		static public function get_formatted_details( $post ) {
			$details = array();
			$phone = esc_html( get_post_meta( $post->ID, 'phone', true ) );
			$email = is_email( get_post_meta( $post->ID, 'email', true ) );
			$website = esc_url( get_post_meta( $post->ID, 'website', true ) );
			if( $phone ) {
				$details[] = '<strong>Phone:</strong> '.$phone;
			}
			if( $email ) {
				$details[] = '<strong>Email:</strong> <a href="mailto:'.$email.'">'.$email.'</a>';
			}
			if( $website ) {
				$details[] = '<strong>Website:</strong> <a href="'.$website.'" target="_blank">'.$website.'</a>';
			}
			$details = implode( '<br>', $details );
			return $details;
		}
		
		static public function get_formatted_hours_list( $post ) {
			
			// Init vars
			$opening_hours = get_post_meta( $post->ID, 'opening_hours', true );
			$day_names = array( 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', );
			$lines = array();
			$prev_i = -1;
			$prev_day_hours = '';
			
			// Loop days of the week
			foreach( $day_names as $i => $day_name ) {
				
				// Get day hours
				$day_hours = array_filter( array(
					!empty( $opening_hours[$i][0] ) ? esc_html( $opening_hours[$i][0] ) : '',
					!empty( $opening_hours[$i][1] ) ? esc_html( $opening_hours[$i][1] ) : ''
				) );
				$day_hours = implode( '-', $day_hours );
				
				// Skip empty elements
				if( empty( $day_hours ) ) {
					$prev_day_hours = '';
					continue;
				}
				
				// Add to lines array
				if( $day_hours == $prev_day_hours ) {
					$lines[ $prev_i ][ $day_hours ][1] = $day_name;
				} else {
					$lines[ $i ] = array( $day_hours => array( $day_name ) );
					$prev_day_hours = $day_hours;
					$prev_i = $i;
				}
			}
			
			// Return markup
			foreach( $lines as $i => $line ) {
				$lines[ $i ] = '<strong>'.implode( '-', reset( $line ) ).':</strong> '.key( $line );
			}
			$formatted_hours = implode( '<br>', $lines );
			return $formatted_hours;
			
		}
		
		
	}
}
