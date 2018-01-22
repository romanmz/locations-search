<?php
/**
 * Displays the markup for the 'opening hours' table
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

$opening_hours = $atts['value'];
$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
?>
<h2 class="locsearch_metabox__subheading">Opening Hours</h2>
<table class="locsearch_metabox__table">
	<thead>
		<tr>
			<th>&nbsp;</th>
			<th>Opens</th>
			<th>Closes</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach( $days as $i => $day_name ) {
			$row_id = "opening_hours_{$i}";
			$row_name = "opening_hours[{$i}]";
			$opens = isset( $opening_hours[$i]['opens'] ) ? $opening_hours[$i]['opens'] : '';
			$closes = isset( $opening_hours[$i]['closes'] ) ? $opening_hours[$i]['closes'] : '';
			printf( '
				<tr>
					<td>
						<label for="%1$s">%3$s</label>
					</td>
					<td>
						<input type="text" name="%2$s[opens]" value="%4$s" id="%1$s">
					</td>
					<td>
						<input type="text" name="%2$s[closes]" value="%5$s">
					</td>
				</tr>',
				$row_id,
				$row_name,
				$day_name,
				esc_attr( $opens ),
				esc_attr( $closes )
			);
		}
		?>
	</tbody>
</table>
