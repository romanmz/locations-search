<?php
/**
 * Displays the markup for an individual meta box select field
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Get list of options
$atts['options'] = isset( $atts['options'] ) ? (array) $atts['options'] : [];
$atts['options'] = apply_filters( 'meta_box/select_options/'.$atts['name'], $atts['options'] );
?>
<div class="locsearch_metabox__column">
	<label for="<?php esc_attr_e( $atts['id'] ) ?>"><?php echo esc_html( $atts['label'] ) ?></label>
	<select id="<?php esc_attr_e( $atts['id'] ) ?>" name="<?php esc_attr_e( $atts['name'] ) ?>">
		<?php foreach( $atts['options'] as $select_key => $select_label ) : ?>
			<option value="<?php esc_attr_e( $select_key ) ?>"<?php selected( $atts['value'], $select_key ) ?>><?php echo esc_html( $select_label ) ?></option>
		<?php endforeach ?>
	</select>
</div>
