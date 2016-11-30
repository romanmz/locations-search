<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Views
// ==================================================

if( !class_exists( 'LocationsSearchViews' ) ) {
	class LocationsSearchViews {
		
		
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
			
			// Output form
			$html = sprintf( '
				<form class="lsform" action="%s" method="%s">
					%s
					%s
					<div class="lsform__field lsform__submit">
						<button id="lsform__submit" type="submit">Search</button>
					</div>
					<div class="lsform__options"></div>
					<div class="lsform__summary"></div>
				</form>',
				esc_url( $action ),
				( strtolower( $method ) == 'post' ) ? 'post' : 'get',
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
				$html = sprintf(
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
				$html = sprintf( '
					<div class="lsform__field lsform__distance">
						<label for="lsform__distance">%s</label>
						<select id="lsform__distance" name="distance" title="%s">
							%s
						</select>
					</div>',
					esc_html( 'Distance' ),
					esc_attr( 'Distance' ),
					$options_html
				);
			}
			
			// Pre-defined units
			if( $units != 'select' ) {
				$html .= sprintf(
					'<input id="lsform__distanceunits" type="hidden" name="distance_units" value="%s">',
					$units
				);
			}
			
			// Allow units selection
			else {
				$html .= sprintf(
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
			
			// Return
			return $html;
			
		}
		
		
	}
}
