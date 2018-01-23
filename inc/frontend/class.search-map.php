<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;

/**
 * Creates an interactive map to search and filter locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map {
	
	/**
	 * Init function
	 * 
	 * Registers the necessary hooks and functions
	 * 
	 * @return void
	 */
	static public function init() {
		static $instance = null;
		if( is_null( $instance ) ) {
			$instance = new self;
		}
	}
	
	/**
	 * Constructor function
	 * 
	 * @return void
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', [$this, 'load_assets'] );
		add_shortcode( 'locations_map', [$this, 'locations_map'] );
	}
	
	/**
	 * Loads the necessary assets for the search map
	 * 
	 * @return void
	 */
	public function load_assets() {
		$settings = get_option( 'locsearch' );
		wp_enqueue_style( NS\PLUGIN_NAME.'_search-map', NS\PLUGIN_URL.'assets/css/search-map.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key='.$settings['google_api_key'] );
		wp_enqueue_script( 'markerclusterer', NS\PLUGIN_URL.'assets/vendor/marker-clusterer/markerclusterer.js', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_search-map', NS\PLUGIN_URL.'assets/js/search-map.js', [NS\PLUGIN_NAME.'_google-maps-api', 'markerclusterer', 'jquery'], NS\PLUGIN_VERSION );
		$js_data = [
			'ajax_url'                  => admin_url( 'admin-ajax.php' ),
			'map_attributes'            => [
				'styles'      => json_decode( $settings['map_styles'] ),
				'initial_lat' => floatVal( -33.865 ),
				'initial_lng' => floatVal( 151.2094 ),
				'max_zoom'    => absint( 15 ),
			],
		];
		wp_localize_script( NS\PLUGIN_NAME.'_search-map', 'locsearch', $js_data );
	}
	
	/**
	 * Generates a simple map with location markers
	 * 
	 * @param array $atts
	 * @param string $content
	 * @return string
	 */
	public function locations_map( $atts=[], $content='' ) {
		
		// Increase counter
		static $counter = 0;
		$counter++;
		
		// Parse attributes
		$default_atts = [
			'include' => false,	// false: show all locations, array: include only locations in the array (using post IDs)
		];
		$atts = shortcode_atts( $default_atts, $atts, 'locations_map' );
		$atts['include'] = $atts['include'] ? explode( ',', $atts['include'] ) : false;
		
		// Get locations and generate markup
		$query_args = [ 'post__in' => $atts['include'] ];
		$locations = Search_Map_Model::get_locations( $query_args );
		$html = sprintf(
			'<div id="locsearch_map_%s" class="locsearch_map" data-locations="%s"></div>',
			esc_attr( $counter ),
			esc_attr( json_encode( $locations ) )
		);
		return $html;
	}
}
