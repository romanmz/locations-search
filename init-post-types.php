<?php

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );



// POST TYPE: Location
// ==================================================

if( !function_exists( 'locationssearch_post_type_location' ) ) {
	function locationssearch_post_type_location() {
		
		// Define Labels
		$labels = array(
			'name'                => 'Locations',
			'singular_name'       => 'Location',
			'name_admin_bar'      => 'Location',
			'menu_name'           => 'Locations',
			'all_items'           => 'All Locations',
			'add_new'             => 'Add New',
			'add_new_item'        => 'Add New Location',
			'edit_item'           => 'Edit Location',
			'view_item'           => 'View Location',
			'search_items'        => 'Search Locations',
			'not_found'           => 'No locations found',
			'not_found_in_trash'  => 'No locations found in Trash',
			'parent_item_colon'   => 'Parent Location:',
			'new_item'            => 'New Location',
		);
		
		// Register post type
		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'menu_position'       => 20,
			'menu_icon'           => 'dashicons-location',
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'excerpt', 'revisions', ),
			'has_archive'         => 'locations',
			'can_export'          => true,
			'delete_with_user'    => false,
			'capability_type'     => 'page',
			'rewrite'             => array(
				'slug'            => 'locations',
			),
		);
		register_post_type( 'location', $args );
		
	}
	add_action( 'init', 'locationssearch_post_type_location' );
}
