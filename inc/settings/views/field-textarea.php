<?php
/**
 * Displays the markup for textarea fields
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Settings\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<textarea id="<?php esc_attr_e( $atts['id'] ) ?>" class="large-text" name="<?php esc_attr_e( $atts['name'] ) ?>" rows="10"><?php echo esc_textarea( $atts['value'] ) ?></textarea>
<?php if( !empty( $atts['description'] ) ) : ?>
	<p class="description"><?php echo wp_kses_post( $atts['description'] ) ?></p>
<?php endif ?>
