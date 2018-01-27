<?php
/**
 * Displays the markup for the Location Details meta box
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
		<?php $this->render_field( 'phone' ) ?>
		<?php $this->render_field( 'email' ) ?>
		<?php $this->render_field( 'website' ) ?>
	</div>
	<div>
		<?php $this->render_field( 'opening_hours' ) ?>
	</div>
</div>
