<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// Locations Search Views
// ==================================================

if( !class_exists( 'LocationsSearchViews' ) ) {
	class LocationsSearchViews {
		
		
		// Get "Distance" Field
		// ------------------------------
		static private function get_distance_field( $options ) {
			
			// Clean up options
			$options = (string) $options;
			$options = array_filter( explode( ',', $options ), 'floatval' );
			if( empty( $options ) ) {
				$options = array( 25 );
			}
			
			// Get requested option
			$selected = !empty( $_REQUEST['distance'] ) ? floatval( $_REQUEST['distance'] ) : 0;
			if( !$selected || !in_array( $selected, $options ) ) {
				$selected = reset( $options );
			}
			
			// One option
			if( count( $options ) == 1 ) {
				$html = sprintf(
					'<input id="lsform__distance" type="hidden" name="distance" value="%s">',
					esc_attr( $selected )
				);
				return $html;
			}
			
			// Multiple options
			$options_html = '';
			foreach( $options as $option ) {
				$options_html .= sprintf(
					'<option value="%s"%s>%s</option>',
					$option,
					selected( $option, $selected, false ),
					$option
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
			return $html;
			
		}
		
		
	}
}
