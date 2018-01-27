<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Core
 */

namespace Locations_Search\Core;
use Locations_Search as NS;
use Locations_Search\Settings\General as Settings;

/**
 * Class for Managing Custom Post Types
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Post_Types {
	
	/**
	 * Init function
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @return void
	 */
	static public function init() {
		add_action( 'init', [__CLASS__, 'register_all'] );
	}
	
	/**
	 * Register post types
	 * 
	 * Registers all supported custom post types
	 * 
	 * @return void
	 */
	static public function register_all() {
		self::register_location();
	}
	
	/**
	 * Unregister post types
	 * 
	 * Unregisters all supported custom post types
	 * 
	 * @return void
	 */
	static public function unregister_all() {
		unregister_post_type( 'location' );
	}
	
	/**
	 * Register the 'location' post type
	 * 
	 * @return void
	 */
	static public function register_location() {
		
		// Define labels
		$labels = [
			'name'                  => _x( 'Locations', 'post type general name', 'locations-search' ),
			'singular_name'         => _x( 'Location', 'post type singular name', 'locations-search' ),
			'name_admin_bar'        => _x( 'Location', 'post type name on the admin toolbar', 'locations-search' ),
			'menu_name'             => _x( 'Locations', 'post type name on the admin menu', 'locations-search' ),
			'add_new'               => _x( 'Add New', 'location', 'locations-search' ),
			'add_new_item'          => __( 'Add New Location', 'locations-search' ),
			'edit_item'             => __( 'Edit Location', 'locations-search' ),
			'new_item'              => __( 'New Location', 'locations-search' ),
			'view_item'             => __( 'View Location', 'locations-search' ),
			'view_items'            => __( 'View Locations', 'locations-search' ),
			'search_items'          => __( 'Search Locations', 'locations-search' ),
			'not_found'             => __( 'No locations found.', 'locations-search' ),
			'not_found_in_trash'    => __( 'No locations found in Trash.', 'locations-search' ),
			'parent_item_colon'     => __( 'Parent Location:', 'locations-search' ),
			'all_items'             => __( 'All Locations', 'locations-search' ),
			'archives'              => __( 'Location Archives', 'locations-search' ),
			'attributes'            => __( 'Location Attributes', 'locations-search' ),
			'insert_into_item'      => __( 'Insert into location', 'locations-search' ),
			'uploaded_to_this_item' => __( 'Uploaded to this location', 'locations-search' ),
			'featured_image'        => _x( 'Featured Image', 'location', 'locations-search' ),
			'set_featured_image'    => _x( 'Set featured image', 'location', 'locations-search' ),
			'remove_featured_image' => _x( 'Remove featured image', 'location', 'locations-search' ),
			'use_featured_image'    => _x( 'Use as featured image', 'location', 'locations-search' ),
			'filter_items_list'     => __( 'Filter locations list', 'locations-search' ),
			'items_list_navigation' => __( 'Locations list navigation', 'locations-search' ),
			'items_list'            => __( 'Locations list', 'locations-search' ),
		];
		
		// Register post type
		$permalinks_slug = Settings::get( 'permalinks_base' );
		$args = [
			'labels'                => $labels,
			'public'                => true,
			'menu_position'         => 20,
			'menu_icon'             => 'dashicons-location',
			'hierarchical'          => false,
			'supports'              => ['title', 'editor', 'excerpt', 'revisions'],
			'has_archive'           => $permalinks_slug,
			'can_export'            => true,
			'delete_with_user'      => false,
			'capability_type'       => 'page',
			'rewrite'               => [
				'slug'              => $permalinks_slug,
			],
		];
		register_post_type( 'location', $args );
		
	}
	
}
