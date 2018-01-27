<?php
/**
 * Displays the markup for boolean selector fields
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Settings\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<label>
	<input type="radio" name="<?php esc_attr_e( $atts['name'] ) ?>" value=""<?php checked( false, $atts['value'] ) ?>>
	<?php echo !empty( $atts['bool_values'][0] ) ? $atts['bool_values'][0] : 'No' ?>
</label>
&nbsp;
<label>
	<input type="radio" name="<?php esc_attr_e( $atts['name'] ) ?>" value="1"<?php checked( true, $atts['value'] ) ?>>
	<?php echo !empty( $atts['bool_values'][1] ) ? $atts['bool_values'][1] : 'Yes' ?>
</label>
<?php if( !empty( $atts['description'] ) ) : ?>
	<p class="description"><?php echo wp_kses_post( $atts['description'] ) ?></p>
<?php endif ?>
