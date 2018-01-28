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
class Map_Shortcodes {
	
	/**
	 * @var Locations_Search\Settings\General Holds a reference to the general settings page
	 */
	protected $settings;
	
	/**
	 * @var Locations_Search\Data\Locations Holds a reference to the locations database class
	 */
	protected $locations_db;
	
	/**
	 * Constructor function
	 * 
	 * @param Locations_Search\Settings\General $settings
	 * @param Locations_Search\Data\Locations $locations_db
	 * @return void
	 */
	public function __construct( $settings, $locations_db ) {
		$this->settings = $settings;
		$this->locations_db = $locations_db;
		add_action( 'wp_enqueue_scripts', [$this, 'load_assets'] );
		add_shortcode( 'locations_map', [$this, 'locations_map'] );
		add_shortcode( 'locations_search', [$this, 'locations_search'] );
		add_shortcode( 'locations_search_form', [$this, 'locations_search_form'] );
		add_action( 'wp_ajax_'.'locations_search', [$this, 'ajax_closest_locations'] );
		add_action( 'wp_ajax_nopriv_'.'locations_search', [$this, 'ajax_closest_locations'] );
	}
	
	/**
	 * Loads the necessary assets for the search map
	 * 
	 * @return void
	 */
	public function load_assets() {
		global $post;
		if( !is_singular() || ( !has_shortcode( $post->post_content, 'locations_map' ) && !has_shortcode( $post->post_content, 'locations_search' ) ) ) {
			return;
		}
		wp_enqueue_script( 'google-maps-api', '//maps.googleapis.com/maps/api/js?key='.$this->settings->google_api_key, null, null, true );
		wp_enqueue_script( 'markerclusterer', NS\PLUGIN_URL.'assets/vendor/marker-clusterer/markerclusterer.js', [], NS\PLUGIN_VERSION, true );
		wp_enqueue_script( NS\PLUGIN_NAME.'_shortcodes', NS\PLUGIN_URL.'assets/js/shortcodes.js', ['google-maps-api', 'markerclusterer', 'jquery'], NS\PLUGIN_VERSION, true );
		$js_data = [
			'ajax_url'            => admin_url( 'admin-ajax.php' ),
			'map_attributes'      => [
				'styles'          => json_decode( $this->settings->map_styles ),
				'initial_lat'     => floatVal( -33.865 ),
				'initial_lng'     => floatVal( 151.2094 ),
				'max_zoom'        => absint( 15 ),
				'clusters_image'  => $this->get_cluster_attributes( $this->settings->map_cluster ),
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
		
		// Check Google API
		if( !$this->settings->google_api_key ) {
			return sprintf( '<p>%s</p>', esc_html__( 'A Google Maps API key is required for the locations search functionality to work.', 'locations-search' ) );
		}
		
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
		$locations = $this->locations_db->get_locations( $query_args );
		$locations = array_map( [$this, 'prepare_data_for_ajax'], $locations );
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
	public function locations_search( $atts=[], $content='' ) {
		
		// Check Google API
		if( !$this->settings->google_api_key ) {
			return sprintf( '<p>%s</p>', esc_html__( 'A Google Maps API key is required for the locations search functionality to work.', 'locations-search' ) );
		}
		
		// Increase counter
		static $counter = 0;
		$counter++;
		
		// Parse attributes
		$default_atts = [
			'layout' => 'horizontal',
		];
		$atts = shortcode_atts( $default_atts, $atts, 'locations_search' );
		
		// Output box
		$html = sprintf(
			'<div id="locsearch_box_%s" class="locsearch_box locsearch_box--%s">
				%s
				<div class="locsearch_messages"></div>
				<div class="locsearch_results_container">
					<ul class="locsearch_results"></ul>
					<div class="locsearch_map"></div>
				</div>
			</div>',
			$counter,
			$atts['layout'] === 'vertical' ? 'vertical' : 'horizontal',
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
		
		// Check Google API
		if( !$this->settings->google_api_key ) {
			return sprintf( '<p>%s</p>', esc_html__( 'A Google Maps API key is required for the locations search functionality to work.', 'locations-search' ) );
		}
		
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
			'<form id="locsearch_form_%s" class="locsearch_form" action="%s" method="%s"%s>
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
	
	/**
	 * Responds to AJAX with list of locations ordered and filtered by distance
	 * 
	 * @return void
	 */
	public function ajax_closest_locations() {
		$locations = [];
		$lat = isset( $_POST['lat'] ) ? floatval( $_POST['lat'] ) : false;
		$lng = isset( $_POST['lng'] ) ? floatval( $_POST['lng'] ) : false;
		if( $lat !== false && $lng !== false ) {
			$search_radius = isset( $_POST['search_radius'] ) ? floatval( $_POST['search_radius'] ) : $this->settings->search_radius;
			$locations = $this->locations_db->get_closest_locations( $lat, $lng, $search_radius );
			$locations = array_map( [$this, 'prepare_data_for_ajax'], $locations );
		}
		wp_send_json( $locations );
	}
	
	/**
	 * Attach additional info to search results to be used by JS
	 * 
	 * @param array $location
	 * @return array
	 */
	public function prepare_data_for_ajax( $location ) {
		
		// Marker data
		$location['marker_label'] = '';
		$location['marker_images'] = [];
		if( $this->settings->map_marker ) {
			$location['marker_images']['default'] = $this->get_marker_attributes( $this->settings->map_marker );
		}
		if( $this->settings->map_marker_active ) {
			$location['marker_images']['active'] = $this->get_marker_attributes( $this->settings->map_marker_active );
		}
		
		// Add info window
		$info_window = sprintf( '
			<div class="locsearch_infowindow">
				<div class="locsearch_title">%s</div>
				%s
			</div>
			',
			esc_html( $location['title'] ),
			isset( $location['distance'] ) ? format_location_distance( $location['distance'], $location['distance_units'] ) : ''
		);
		$location['info_window'] = $info_window;
		
		// Add results list items
		$list_item = sprintf(
			'<li class="locsearch_result">
				<div class="locsearch_title">%s</div>
				%s
				%s
				%s
				%s
			</li>',
			esc_html( $location['title'] ),
			isset( $location['distance'] ) ? format_location_distance( $location['distance'], $location['distance_units'] ) : '',
			get_location_address( $location['id'] ),
			get_location_details( $location['id'] ),
			get_location_hours( $location['id'] )
		);
		$location['list_item'] = wp_kses_post( $list_item );
		
		// Return updated data
		return $location;
	}
	
	/**
	 * Get attributes array for marker images
	 * 
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	public function get_marker_attributes( $attachment_id, $max_size=40 ) {
		
		// Get image attributes
		$image_atts = $this->get_image_size_attributes( $attachment_id, $max_size );
		if( !$image_atts ) {
			return false;
		}
		
		// Return marker data
		$marker_atts = [
			'url'         => $image_atts[0],
			'size'        => [ $image_atts[1], $image_atts[2] ],
			'scaledSize'  => [ $image_atts[3], $image_atts[4] ],
			'origin'      => [ 0, 0 ],
			'anchor'      => [ round( $image_atts[3] * .5 ), $image_atts[4] ],
			'labelOrigin' => [ round( $image_atts[3] * .5 ), round( $image_atts[4] * .4 ) ],
		];
		return $marker_atts;
	}
	
	/**
	 * Get attributes array for cluster images
	 * 
	 * @link https://github.com/googlemaps/v3-utility-library/blob/master/markerclusterer/src/markerclusterer.js
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	public function get_cluster_attributes( $attachment_id, $max_size=40 ) {
		$image_atts = $this->get_image_size_attributes( $attachment_id, $max_size );
		$cluster_atts = [
			// gridSize
			// zoomOnClick
			// imageExtension
			// averageCenter
			// minimumClusterSize
			'imagePath'   => NS\PLUGIN_URL.'assets/vendor/marker-clusterer/m',
			'maxZoom'     => 15,
		];
		if( $image_atts ) {
			$cluster_atts['styles'] = [
				[
					'url'                => $image_atts[0],
					'width'              => $image_atts[3],
					'height'             => $image_atts[4],
					'backgroundPosition' => 'center center; background-size: contain',
					// 'anchor'          => [ 0, 0 ],
					// 'textColor'       => '#FFFFFF',
					// 'textSize'        => 12,
				]
			];
		}
		return $cluster_atts;
	}
	
	/**
	 * Get size attributes of an image
	 * 
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	public function get_image_size_attributes( $attachment_id, $max_size=40 ) {
		
		// Check ID
		$attachment_id = absint( $attachment_id );
		if( !$attachment_id ) {
			return false;
		}
		
		// Get image data
		$attachment_data = wp_get_attachment_image_src( $attachment_id, 'medium' );
		if( empty( $attachment_data ) ) {
			return false;
		}
		
		// Process attributes
		$url = $attachment_data[0];
		$width = $scaled_width = $attachment_data[1];
		$height = $scaled_height = $attachment_data[2];
		if( ($ratio = $max_size / $scaled_width) < 1 ) {
			$scaled_width = $max_size;
			$scaled_height = round( $scaled_height * $ratio );
		}
		if( ($ratio = $max_size / $scaled_height) < 1 ) {
			$scaled_height = $max_size;
			$scaled_width = round( $scaled_width * $ratio );
		}
		
		// Return array
		$image_atts = [ $url, $width, $height, $scaled_width, $scaled_height ];
		return $image_atts;
	}
	
}
