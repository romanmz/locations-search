<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Views
// ==================================================

if( !class_exists( 'LocationsSearchViews' ) ) {
	class LocationsSearchViews {
		
		
		// Search Form
		// ==================================================
		
		
		// Get "Query" Field
		// ------------------------------
		static private function get_query_field() {
			
			// Get requested query
			$query = !empty( $_REQUEST['query'] ) ? trim( $_REQUEST['query'] ) : '';
			
			// Output field
			$html = sprintf( '
				<div class="lsform__field lsform__query">
					<label for="lsform__query" class="lsform__label">%s</label>
					<input id="lsform__query" type="text" name="query" value="%s" title="%s" placeholder="%s">
				</div>',
				esc_html( 'Query' ),
				esc_attr( $query ),
				esc_attr( 'Query' ),
				esc_attr( 'Enter your postcode or city' )
			);
			return apply_filters( 'locations_search_form_query', $html, $query );
			
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
					<label for="lsform__distance" class="lsform__label">%s</label>
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
					<label for="lsform__distanceunits" class="lsform__label">%s</label>
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
		
		
		// Get "State" Field 
		// ------------------------------
		static private function get_state_field() {
			
			// Get requested query
			$state = !empty( $_REQUEST['state'] ) ? trim( $_REQUEST['state'] ) : '';
			
			// Output field
			$html = sprintf( '
				<div class="lsform__field lsform__state">
					<label for="lsform__state" class="lsform__label">%s</label>
					<input id="lsform__state" type="text" name="state" value="%s">
				</div>',
				esc_html( 'State' ),
				esc_attr( $state )
			);
			return apply_filters( 'locations_search_form_state', $html, $state );
			
		}
		
		
		// Get Category Checkboxes
		// ------------------------------
		static private function get_category_checkboxes( $categories='' ) {
			
			// Check for multiple parent categories
			$parents = explode( ',', $categories );
			$parents = array_filter( $parents, 'trim' );
			if( count( $parents ) > 1 ) {
				return implode( '', array_map( array( get_class(), 'get_category_checkboxes' ), $parents ) );
			}
			
			// Get existing terms
			$selected = !empty( $_REQUEST['lcategory'] ) ? $_REQUEST['lcategory'] : array();
			$parent_term = get_term( absint( $categories ), 'location_category' );
			$terms = get_terms( array(
				'taxonomy' => 'location_category',
				'fields' => 'id=>name',
				'hide_empty' => true,
				'parent' => $categories,
			) );
			
			// Generate checkboxes
			$html = '';
			foreach( $terms as $term_id => $term_name ) {
				$html .= sprintf( '
					<label class="lsform__check">
						<input type="checkbox" name="lcategory[]" value="%s"%s>
						<span>%s</span>
					</label>
					',
					$term_id,
					checked( true, in_array( $term_id, $selected ), false ),
					$term_name
				);
			}
			
			// Wrap and return
			if( !empty( $html ) ) {
				$html = sprintf( '
					<div class="lsform__field lsform__lcategory">
						<span class="lsform__label">%s</span>
						%s
					</div>',
					!empty( $parent_term->name ) ? $parent_term->name : 'Categories',
					$html
				);
			}
			return apply_filters( 'locations_search_form_categorychecks', $html, $selected );
			
		}
		
		
		// Get Category Dropdown
		// ------------------------------
		static private function get_category_dropdown( $categories='' ) {
			
			// Check for multiple parent categories
			$parents = explode( ',', $categories );
			$parents = array_filter( $parents, 'trim' );
			if( count( $parents ) > 1 ) {
				return implode( '', array_map( array( get_class(), 'get_category_dropdown' ), $parents ) );
			}
			
			// Get existing terms
			$selected = !empty( $_REQUEST['lcategory'] ) ? $_REQUEST['lcategory'] : array();
			$parent_term = get_term( absint( $categories ), 'location_category' );
			$terms = get_terms( array(
				'taxonomy' => 'location_category',
				'fields' => 'id=>name',
				'hide_empty' => true,
				'parent' => $categories,
			) );
			
			// Generate options
			$html = '';
			foreach( $terms as $term_id => $term_name ) {
				$html .= sprintf( '
					<option value="%s"%s>%s</option>
					',
					$term_id,
					selected( true, in_array( $term_id, $selected ), false ),
					$term_name
				);
			}
			
			// Wrap and return
			if( !empty( $html ) ) {
				$html = sprintf( '
					<div class="lsform__field lsform__lcategory">
						<label id="lsform__lcategory%1$s" class="lsform__label">%2$s</label>
						<select id="lsform__lcategory%1$s" name="lcategory">
							<option value="">%3$s</option>
							%4$s
						</select>
					</div>',
					!empty( $parent_term->term_id ) ? '-'.$parent_term->term_id : '',
					!empty( $parent_term->name ) ? $parent_term->name : 'Category',
					'(all categories)',
					$html
				);
			}
			return apply_filters( 'locations_search_form_categorychecks', $html, $selected );
			
		}
		
		
		
		// Search Results
		// ==================================================
		
		
		// Get Results HTML
		// ------------------------------
		static public function get_results_html( $post ) {
			
			// Get location details
			$details = self::get_formatted_details( $post );
			$hours = self::get_formatted_hours_list( $post );
			
			// Get categories
			$categories = get_the_terms( $post, 'location_category' );
			if( empty( $categories ) ) $categories = array();
			foreach( $categories as $i => $category ) {
				$categories[ $i ] = "<span class=\"lsform__result__cat lsform__result__cat-{$category->slug}\">{$category->name}</span>";
			}
			
			// Output markup
			$html = sprintf( '
				<h3 class="lsform__result__heading">%s</h3>
				%s
				<address class="lsform__result__address"><p>%s</p></address>
				%s
				%s
				%s
				<div class="lsform__result__links"><a href="%s">More info</a> | <a href="%s" target="_blank">Get directions</a></div>
				',
				get_the_title( $post ),
				$post->distance ? '<div class="lsform__result__distance">Distance: '.round( $post->distance, 1 ).' '.$post->distance_units.'</div>' : '',
				self::get_formatted_address( $post ),
				$details ? '<p class="lsform__result__details">'.$details.'</p>' : '',
				$hours ? '<p class="lsform__result__hours">'.$hours.'</p>' : '',
				!empty( $categories ) ? '<p class="lsform__result__cats">'.implode( '', $categories ).'</p>' : '',
				get_permalink( $post ),
				'https://maps.google.com/maps?'.http_build_query( array( 'saddr'=>'Current Location', 'daddr'=>$post->lat.','.$post->lng ) )
			);
			return apply_filters( 'locations_search_results_html', $html, $post );
			
		}
		
		
		
		// Helper Functions
		// ==================================================
		static public function get_formatted_details( $post ) {
			$details = array();
			$phone = esc_html( get_post_meta( $post->ID, 'phone', true ) );
			$email = is_email( get_post_meta( $post->ID, 'email', true ) );
			$website_raw = get_post_meta( $post->ID, 'website', true );
			$website = esc_url( $website_raw );
			if( $phone ) {
				$details[] = '<strong>Phone:</strong> '.$phone;
			}
			if( $email ) {
				$details[] = '<strong>Email:</strong> <a href="mailto:'.$email.'">'.$email.'</a>';
			}
			if( $website ) {
				$details[] = '<strong>Website:</strong> <a href="'.$website.'" target="_blank">'.esc_html( $website_raw ).'</a>';
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
		
		static public function get_formatted_hours_table( $post ) {
			
			// Init vars
			$opening_hours = get_post_meta( $post->ID, 'opening_hours', true );
			$day_names = array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', );
			
			// Markup rows
			$formatted_hours = '';
			foreach( $day_names as $i => $day_name ) {
				$opens = !empty( $opening_hours[$i][0] ) ? esc_html( $opening_hours[$i][0] ) : '';
				$closes = !empty( $opening_hours[$i][1] ) ? esc_html( $opening_hours[$i][1] ) : '';
				if( $opens || $closes ) {
					$formatted_hours .= sprintf( '
						<tr>
							<th>%s</th>
							<td>%s</td>
							<td>%s</td>
						</tr>',
						$day_name,
						$opens,
						$closes
					);
				}
			}
			
			// Finish table and return
			if( !empty( $formatted_hours ) ) {
				$formatted_hours = sprintf( '
					<table>
						<thead>
							<tr>
								<th></th>
								<td>Opens</td>
								<td>Closes</td>
							</tr>
						</thead>
						<tbody>
							%s
						</tbody>
					</table>
					',
					$formatted_hours
				);
			}
			return $formatted_hours;
			
		}
		
		
	}
}
