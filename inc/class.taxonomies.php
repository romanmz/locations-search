<?php
/**
 * Class for Managing Custom Taxonomies
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Core
 */

namespace Locations_Search\Core;
use Locations_Search as NS;

/**
 * Class for Managing Custom Taxonomies
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Taxonomies {
	
	/**
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * Constructor method
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @return void
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
		add_action( 'init', [$this, 'register_all'] );
	}
	
	/**
	 * Register taxonomies
	 * 
	 * Registers all supported custom taxonomies
	 * 
	 * @return void
	 */
	public function register_all() {
		$this->register_location_category();
	}
	
	/**
	 * Unregister taxonomies
	 * 
	 * Unregisters all supported custom taxonomies
	 * 
	 * @return void
	 */
	public function unregister_all() {
		unregister_taxonomy( 'location_category' );
	}
	
	/**
	 * Register the 'location category' taxononomy
	 * 
	 * @return void
	 */
	public function register_location_category() {
		
		// Define labels
		$labels = [
			'name'                       => _x( 'Location Categories', 'taxonomy general name', 'locations-search' ),
			'singular_name'              => _x( 'Location Category', 'taxonomy singular name', 'locations-search' ),
			'name_admin_bar'             => _x( 'Location Category', 'taxonomy name on the admin toolbar', 'locations-search' ),
			'menu_name'                  => _x( 'Categories', 'taxonomy name on the admin menu', 'locations-search' ),
			'search_items'               => __( 'Search Location Categories', 'locations-search' ),
			'popular_items'              => __( 'Popular Location Categories', 'locations-search' ),
			'all_items'                  => __( 'All Location Categories', 'locations-search' ),
			'archives'                   => __( 'Location Category Archives', 'locations-search' ),
			'parent_item'                => __( 'Parent Location Category', 'locations-search' ),
			'parent_item_colon'          => __( 'Parent Location Category:', 'locations-search' ),
			'edit_item'                  => __( 'Edit Location Category', 'locations-search' ),
			'view_item'                  => __( 'View Location Category', 'locations-search' ),
			'update_item'                => __( 'Update Location Category', 'locations-search' ),
			'add_new_item'               => __( 'Add New Location Category', 'locations-search' ),
			'new_item_name'              => __( 'New Location Category Name', 'locations-search' ),
			'separate_items_with_commas' => __( 'Separate location categories with commas', 'locations-search' ),
			'add_or_remove_items'        => __( 'Add or remove location categories', 'locations-search' ),
			'choose_from_most_used'      => __( 'Choose from the most used location categories', 'locations-search' ),
			'not_found'                  => __( 'No location categories found.', 'locations-search' ),
			'no_terms'                   => __( 'No location categories', 'locations-search' ),
			'items_list_navigation'      => __( 'Location categories list navigation', 'locations-search' ),
			'items_list'                 => __( 'Location categories list', 'locations-search' ),
			'most_used'                  => _x( 'Most Used', 'location categories', 'locations-search' ),
			'back_to_items'              => __( '&larr; Back to Location Categories', 'locations-search' ),
		];
		
		// Register taxonomy
		$permalinks_slug = $this->settings->permalinks_base.'/'.$this->settings->permalinks_category;
		$args = [
			'labels'                     => $labels,
			'public'                     => true,
			'show_admin_column'          => true,
			'description'                => '',
			'hierarchical'               => true,
			'rewrite'                    => [
				'slug'                   => $permalinks_slug,
			],
		];
		register_taxonomy( 'location_category', 'location', $args );
		
	}
	
}
