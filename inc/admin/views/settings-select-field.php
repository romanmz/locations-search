<?php
/**
 * Displays the markup for the backend settings page
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Admin\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Get list of options
$atts['options'] = isset( $atts['options'] ) ? (array) $atts['options'] : [];
$atts['options'] = apply_filters( 'settings_page/select_options/'.$atts['slug'], $atts['options'] );
?>
<select id="<?php esc_attr_e( $atts['id'] ) ?>" name="<?php esc_attr_e( $atts['name'] ) ?>">
	<?php foreach( $atts['options'] as $select_key => $select_label ) : ?>
		<option value="<?php esc_attr_e( $select_key ) ?>"<?php selected( $atts['value'], $select_key ) ?>><?php echo esc_html( $select_label ) ?></option>
	<?php endforeach ?>
</select>
<?php if( !empty( $atts['description'] ) ) : ?>
	<p class="description"><?php echo wp_kses_post( $atts['description'] ) ?></p>
<?php endif ?>
