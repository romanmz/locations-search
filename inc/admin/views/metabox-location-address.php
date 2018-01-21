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
<div class="locsearch_metabox">
	<div class="locsearch_metabox__row">
		<?php self::render_field( 'address' ) ?>
		<?php self::render_field( 'address2' ) ?>
	</div>
	<div class="locsearch_metabox__row">
		<?php self::render_field( 'city' ) ?>
		<?php self::render_field( 'postcode' ) ?>
	</div>
	<div class="locsearch_metabox__row">
		<?php self::render_field( 'state' ) ?>
		<?php self::render_field( 'country' ) ?>
	</div>
	<div id="locsearch_metabox__map_update">
		<button class="button">Update Map</button>
		<div id="locsearch_metabox__alternatives"></div>
	</div>
	<div class="locsearch_metabox__row">
		<?php self::render_field( 'lat' ) ?>
		<?php self::render_field( 'lng' ) ?>
	</div>
	<div id="locsearch_metabox__map"></div>
</div>
