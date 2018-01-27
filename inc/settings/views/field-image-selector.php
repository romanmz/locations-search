<?php
/**
 * Displays the markup for image selector fields
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Settings\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<div class="locsearch_mediaupload" data-frame-title="Select an image" data-frame-button-text="Use this image">
	<div class="locsearch_mediaupload__preview">
		<?php echo wp_get_attachment_image( absint( $atts['value'] ), 'medium' ) ?>
	</div>
	<input type="hidden" class="locsearch_mediaupload__field" id="<?php esc_attr_e( $atts['id'] ) ?>" name="<?php esc_attr_e( $atts['name'] ) ?>" value="<?php esc_attr_e( $atts['value'] ) ?>">
	<input type="button" class="locsearch_mediaupload__upload button" value="Select File" data-label-replace="Replace File">
	<input type="button" class="locsearch_mediaupload__reset button hidden" value="Remove File">
</div>
<?php if( !empty( $atts['description'] ) ) : ?>
	<p class="description"><?php echo wp_kses_post( $atts['description'] ) ?></p>
<?php endif ?>
