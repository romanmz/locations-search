<?php
/**
 * Displays the markup for an individual meta box text field
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Meta_Boxes\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<div class="locsearch_metabox__column">
	<label for="<?php esc_attr_e( $atts['id'] ) ?>"><?php echo esc_html( $atts['label'] ) ?></label>
	<input type="<?php esc_attr_e( $atts['type'] ) ?>" id="<?php esc_attr_e( $atts['id'] ) ?>" name="<?php esc_attr_e( $atts['name'] ) ?>" value="<?php esc_attr_e( $atts['value'] ) ?>" size="25">
</div>
