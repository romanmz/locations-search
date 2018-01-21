<?php
/**
 * Displays the markup for an individual meta box text field
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<div class="locsearch_metabox__field">
	<label for="<?php esc_attr_e( $atts['id'] ) ?>"><?php echo esc_html( $atts['label'] ) ?></label>
	<input type="text" id="<?php esc_attr_e( $atts['id'] ) ?>" name="<?php esc_attr_e( $atts['name'] ) ?>" value="<?php esc_attr_e( $atts['value'] ) ?>" size="25">
</div>
