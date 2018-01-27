<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Shortcodes
 */

namespace Locations_Search\Shortcodes;
use Locations_Search as NS;

/**
 * Creates an interactive map to search and filter locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map {
	
	/**
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * @var Locations_Search\Shortcodes\Search_Map_Model Holds a reference to the shortcode model class
	 */
	protected $model;
	
	/**
	 * @var Locations_Search\Shortcodes\Search_Map_Helpers Holds a reference to the shortcode helpers
	 */
	protected $helpers;
	
	/**
	 * Constructor function
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @return void
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
		$this->helpers = new Search_Map_Helpers();
		$this->model = new Search_Map_Model( $settings, $this->helpers );
		add_action( 'wp_enqueue_scripts', [$this, 'load_assets'] );
		add_shortcode( 'locations_map', [$this, 'locations_map'] );
		add_shortcode( 'locations_map_search', [$this, 'locations_map_search'] );
		add_shortcode( 'locations_search_form', [$this, 'locations_search_form'] );
		add_action( 'wp_ajax_'.'locations_map_search', [$this->model, 'ajax_closest_locations'] );
		add_action( 'wp_ajax_nopriv_'.'locations_map_search', [$this->model, 'ajax_closest_locations'] );
	}
	
	/**
	 * Loads the necessary assets for the search map
	 * 
	 * @return void
	 */
	public function load_assets() {
		wp_enqueue_style( NS\PLUGIN_NAME.'_shortcodes', NS\PLUGIN_URL.'assets/css/shortcodes.css', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_google-maps-api', '//maps.googleapis.com/maps/api/js?key='.$this->settings->google_api_key );
		wp_enqueue_script( 'markerclusterer', NS\PLUGIN_URL.'assets/vendor/marker-clusterer/markerclusterer.js', [], NS\PLUGIN_VERSION );
		wp_enqueue_script( NS\PLUGIN_NAME.'_shortcodes', NS\PLUGIN_URL.'assets/js/shortcodes.js', [NS\PLUGIN_NAME.'_google-maps-api', 'markerclusterer', 'jquery'], NS\PLUGIN_VERSION );
		$js_data = [
			'ajax_url'            => admin_url( 'admin-ajax.php' ),
			'map_attributes'      => [
				'styles'          => json_decode( $this->settings->map_styles ),
				'initial_lat'     => floatVal( -33.865 ),
				'initial_lng'     => floatVal( 151.2094 ),
				'max_zoom'        => absint( 15 ),
				'clusters_image'  => $this->helpers->get_cluster_attributes( $this->settings->map_cluster ),
				'focus_country'   => esc_html( $this->settings->focus_country ),
				'focus_strict'    => boolval( $this->settings->focus_strict ),
				'search_radius'   => absint( $this->settings->search_radius ),
				'max_radius'      => absint( $this->settings->max_radius ),
			],
			'alerts'              => [
				'api_unavailable' => __( 'The Google Maps API is unavailable at the moment, try again later', 'locations-search' ),
				'empty_address'   => __( 'Please enter an address', 'locations-search' ),
				'invalid_request' => __( 'Invalid request, please verify that the address you entered is correct', 'locations-search' ),
				'query_limit'     => __( 'You have exceeded the maximum number of allowed queries, please wait some time before trying again', 'locations-search' ),
				'no_results'      => __( 'No results found, please try with a different address', 'locations-search' ),
				'unknown_error'   => __( 'There was an unknown error, please try again', 'locations-search' ),
			],
			'text'                => [
				'did_you_mean'    => __( 'Did you mean:', 'locations-search' ),
				'searching_near'  => __( 'Searching near:', 'locations-search' ),
				'your_location'   => __( 'Your current location', 'locations-search' ),
				'0_results'       => __( 'No locations found', 'locations-search' ),
				'1_result'        => __( '1 location found', 'locations-search' ),
				'many_results'    => __( '%s locations found', 'locations-search' ),
			],
		];
		wp_localize_script( NS\PLUGIN_NAME.'_shortcodes', 'locsearch', $js_data );
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
		$locations = $this->model->get_locations( $query_args );
		$html = sprintf(
			'<div id="locsearch_map_%s" class="locsearch_map" data-locations="%s"></div>',
			esc_attr( $counter ),
			esc_attr( json_encode( $locations ) )
		);
		return $html;
	}
	
	/**
	 * Generates a search box to find and display locations on a map
	 * 
	 * @param array $atts
	 * @param string $content
	 * @return string
	 */
	public function locations_map_search( $atts=[], $content='' ) {
		
		// Increase counter
		static $counter = 0;
		$counter++;
		
		// Parse attributes
		$default_atts = [
		];
		$atts = shortcode_atts( $default_atts, $atts, 'locations_map_search' );
		
		// Output box
		$html = sprintf(
			'<div id="locsearch_box_%s" class="locsearch_box">
				%s
				<div class="locsearch_box__messages"></div>
				<div class="locsearch_box__results__container">
					<ul class="locsearch_box__results"></ul>
					<div class="locsearch_box__map"></div>
				</div>
			</div>',
			$counter,
			$this->locations_search_form(),
			$counter
		);
		return $html;
	}
	
	/**
	 * Generates a locations search form
	 * 
	 * @param array $atts
	 * @param string $content
	 * @return string
	 */
	public function locations_search_form( $atts=[], $content='' ) {
		
		// Increase counter
		static $counter = 0;
		$counter++;
		
		// Parse settings
		$default_atts = [
			'url'    => is_singular() ? get_permalink() : '',
			'method' => 'post',
		];
		$atts = shortcode_atts( $default_atts, $atts, 'locations_search_form' );
		
		// Read user submitted values
		$autoload = !empty( $_POST['autosearch'] ) && wp_get_referer();
		$address = !empty( $_REQUEST['address'] ) ? $_REQUEST['address'] : '';
		
		// Output form
		$html = sprintf(
			'<form id="locsearch_box__form_%s" class="locsearch_box__form" action="%s" method="%s"%s>
				<input type="text" name="address" value="%s" placeholder="%s">
				<input type="hidden" name="autosearch" value="1">
				<button>%s</button>
			</form>',
			$counter,
			esc_url( $atts['url'] ),
			esc_attr( $atts['method'] ),
			$autoload ? ' data-locsearch-autosearch="1"' : '',
			esc_attr( $address ),
			__( 'Enter your address', 'locations-search' ),
			_x( 'Search', 'locations search form', 'locations-search' )
		);
		return $html;
	}
	
}
