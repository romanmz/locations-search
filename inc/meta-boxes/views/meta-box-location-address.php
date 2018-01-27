<?php
/**
 * Displays the markup for the Location Address meta box
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Meta_Boxes\Views
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

?>
<div class="locsearch_metabox">
	<div class="locsearch_metabox__row">
		<?php $this->render_field( 'address' ) ?>
		<?php $this->render_field( 'address2' ) ?>
	</div>
	<div class="locsearch_metabox__row">
		<?php $this->render_field( 'city' ) ?>
		<?php $this->render_field( 'postcode' ) ?>
	</div>
	<div class="locsearch_metabox__row">
		<?php $this->render_field( 'state' ) ?>
		<?php $this->render_field( 'country' ) ?>
	</div>
	<div id="locsearch_metabox__map_update">
		<button class="button">Update Map</button>
		<div id="locsearch_metabox__alternatives"></div>
	</div>
	<div class="locsearch_metabox__row">
		<?php $this->render_field( 'lat' ) ?>
		<?php $this->render_field( 'lng' ) ?>
	</div>
	<div id="locsearch_metabox__map"></div>
</div>
