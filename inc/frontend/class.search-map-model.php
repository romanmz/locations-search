<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;
use Locations_Search\Admin\Settings_Page_General as Settings;

/**
 * Database queries for finding locations
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map_Model {
	
	/**
	 * Responds to AJAX with list of locations ordered and filtered by distance
	 * 
	 * @return void
	 */
	static public function ajax_closest_locations() {
		$locations = [];
		$lat = isset( $_POST['lat'] ) ? floatval( $_POST['lat'] ) : false;
		$lng = isset( $_POST['lng'] ) ? floatval( $_POST['lng'] ) : false;
		if( $lat !== false && $lng !== false ) {
			$search_radius = isset( $_POST['search_radius'] ) ? floatval( $_POST['search_radius'] ) : Settings::get( 'search_radius' );
			$locations = static::get_closest_locations( $lat, $lng, $search_radius );
		}
		wp_send_json( $locations );
	}
	
	/**
	 * Returns a list of locations ordered by proximity to the requested coordinates
	 * 
	 * @param float $lat
	 * @param float $lng
	 * @param float $search_radius
	 * @param string $distance_units
	 * @return array
	 */
	static public function get_closest_locations( $lat, $lng, $search_radius=0, $distance_units='km' ) {
		
		// Init vars
		global $wpdb;
		$lat = floatval( $lat );
		$lng = floatval( $lng );
		$search_radius = $search_radius ? floatval( $search_radius ) : Settings::get( 'search_radius' );
		$distance_units = ( $distance_units == 'miles' ) ? 'miles' : 'km';
		$distance_factor = ( $distance_units == 'miles' ) ? 3959 : 6371;
		
		// Prepare query
		$query = "
			SELECT DISTINCT
				posts.ID as id,
				latitude.meta_value as lat,
				longitude.meta_value as lng,
				'{$distance_units}' as distance_units,
				(
					ACOS(
						SIN( RADIANS( {$lat} ) )
						* SIN( RADIANS( latitude.meta_value ) )
						+ COS( RADIANS( {$lat} ) )
						* COS( RADIANS( latitude.meta_value ) )
						* COS( RADIANS( {$lng} - longitude.meta_value ) )
					)
					* {$distance_factor}
				) as distance
			FROM
				{$wpdb->prefix}posts as posts
				LEFT JOIN {$wpdb->prefix}postmeta as latitude ON latitude.post_id = posts.ID
				LEFT JOIN {$wpdb->prefix}postmeta as longitude ON longitude.post_id = posts.ID
			WHERE
				posts.post_type = 'location'
				AND posts.post_status = 'publish'
				AND latitude.meta_key = 'lat'
				AND longitude.meta_key = 'lng'
			HAVING
				distance < {$search_radius}
			ORDER BY
				distance ASC
		";
		
		// Get posts and return location data
		$post_ids = $wpdb->get_results( $query, ARRAY_A );
		$locations = array_map( [__CLASS__, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns a list of locations from the database
	 * 
	 * @param array $query_args
	 * @return array
	 */
	static public function get_locations( $query_args=[] ) {
		
		// Prepare query
		$default_args = [
			'post_type'           => 'location',
			'posts_per_page'      => -1,
			'post__in'            => '',
			'ignore_sticky_posts' => true,
			'fields'              => 'ids',
		];
		$query_args = wp_parse_args( $query_args, $default_args );
		
		// Get posts and return location data
		$post_ids = get_posts( $query_args );
		$locations = array_map( [__CLASS__, 'prepare_location_data'], $post_ids );
		return $locations;
	}
	
	/**
	 * Returns the location data for a particular post
	 * 
	 * @param int|array $data
	 * @return array
	 */
	static public function prepare_location_data( $data ) {
		
		// Prepare basic information
		if( !is_array( $data ) ) {
			$data = [
				'id'    => $data,
				'lat'   => get_post_meta( $data, 'lat', true ),
				'lng'   => get_post_meta( $data, 'lng', true ),
			];
		}
		$data['id']    = absint( $data['id'] );
		$data['lat']   = floatval( $data['lat'] );
		$data['lng']   = floatval( $data['lng'] );
		$data['title'] = get_the_title( $data['id'] );
		$data['marker_label'] = '';
		$data['url']   = get_permalink( $data['id'] );
		if( isset( $data['distance'] ) ) {
			$data['distance'] = floatval( $data['distance'] );
		}
		
		// Add marker images
		$data['images'] = [];
		if( Settings::get( 'map_marker' ) ) {
			$data['images']['marker'] = Search_Map_Helpers::get_marker_attributes( Settings::get( 'map_marker' ) );
		}
		if( Settings::get( 'map_marker_active' ) ) {
			$data['images']['marker_active'] = Search_Map_Helpers::get_marker_attributes( Settings::get( 'map_marker_active' ) );
		}
		
		// Add info window
		$info_window = sprintf( '
			<div class="locsearch_infowindow">
				<div class="locsearch_infowindow__title">%s</div>
				<div class="locsearch_infowindow__distance">%s</div>
			</div>
			',
			esc_html( $data['title'] ),
			isset( $data['distance'] ) ? 'Distance: '.round( $data['distance'], 1 ).' '.$data['distance_units'] : ''
		);
		$data['info_window'] = $info_window;
		
		// Add list items
		$list_item = sprintf(
			'<li class="locsearch_box__result">
				<div class="locsearch_box__result__heading">%s</div>
				<div class="locsearch_box__result__distance">%s</div>
				<div class="locsearch_box__result__address">%s</div>
				<div class="locsearch_box__result__details">%s</div>
				<div class="locsearch_box__result__hours">%s</div>
			</li>',
			esc_html( $data['title'] ),
			isset( $data['distance'] ) ? 'Distance: '.round( $data['distance'], 1 ).' '.$data['distance_units'] : '',
			static::get_formatted_address( $data['id'] ),
			static::get_formatted_details( $data['id'] ),
			static::get_formatted_hours( $data['id'] )
		);
		$data['list_item'] = wp_kses_post( $list_item );
		
		// Return
		return $data;
	}
	
	/**
	 * Returns a nicely formatted address from a location
	 * 
	 * @param int $post_id
	 * @return string
	 */
	static public function get_formatted_address( $post_id ) {
		$meta_keys = ['address', 'address2', 'city', 'state', 'postcode', 'country'];
		foreach( $meta_keys as $meta_key ) {
			$$meta_key = trim( esc_html( get_post_meta( $post_id, $meta_key, true ) ) );
		}
		$address_line_1 = $address;
		$address_line_2 = $address2;
		$address_line_3 = implode( ', ', array_filter( [$city, $state, $postcode, $country] ) );
		$formatted_address = implode( '<br>', array_filter( [$address_line_1, $address_line_2, $address_line_3] ) );
		return $formatted_address;
	}
	
	/**
	 * Returns a nicely formatted list of location details
	 * 
	 * @param int $post_id
	 * @return string
	 */
	static public function get_formatted_details( $post_id ) {
		$details = [];
		// Phone
		$phone = esc_html( get_post_meta( $post_id, 'phone', true ) );
		if( $phone ) {
			$details[] = '<div><strong>Phone:</strong> <a href="tel:'.esc_attr( $phone ).'">'.$phone.'</a></div>';
		}
		// Email
		$email = is_email( get_post_meta( $post_id, 'email', true ) );
		if( $email ) {
			$details[] = '<div><strong>Email:</strong> <a href="mailto:'.esc_attr( $email ).'">'.esc_html( $email ).'</a></div>';
		}
		// Website
		$website_raw = get_post_meta( $post_id, 'website', true );
		$website = esc_url( $website_raw );
		if( $website ) {
			$details[] = '<div><strong>Website:</strong> <a href="'.esc_attr( $website ).'" target="_blank">'.esc_html( $website_raw ).'</a></div>';
		}
		// Output
		$details = implode( '', $details );
		return $details;
	}
	
	/**
	 * Returns a nicely formatted list of opening hours
	 * 
	 * @param int $post_id
	 * @return string
	 */
	static public function get_formatted_hours( $post_id ) {
		
		// Load data
		$opening_hours = get_post_meta( $post_id, 'opening_hours', true );
		if( empty( $opening_hours ) || !is_array( $opening_hours ) ) {
			return '';
		}
		
		// Setup vars
		$dow_names = [
			_x( 'Mon', 'short for Monday', 'locations-search' ),
			_x( 'Tue', 'short for Tuesday', 'locations-search' ),
			_x( 'Wed', 'short for Wednesday', 'locations-search' ),
			_x( 'Thu', 'short for Thursday', 'locations-search' ),
			_x( 'Fri', 'short for Friday', 'locations-search' ),
			_x( 'Sat', 'short for Saturday', 'locations-search' ),
			_x( 'Sun', 'short for Sunday', 'locations-search' ),
		];
		$lines = [];
		$prev_row = -1;
		$prev_hours = '';
		
		// Loop days of the week
		foreach( $dow_names as $i => $day_name ) {
			
			// Get today's hours
			$opens  = !empty( $opening_hours[$i]['opens'] )  ? esc_html( $opening_hours[$i]['opens'] )  : '';
			$closes = !empty( $opening_hours[$i]['closes'] ) ? esc_html( $opening_hours[$i]['closes'] ) : '';
			$today_hours = implode( '–', array_filter( [$opens, $closes] ) );
			
			// Skip empty rows
			if( empty( $today_hours ) ) {
				$prev_hours = '';
				continue;
			}
			// If today's hours are the same as yesterday, keep them in the same row
			if( $today_hours == $prev_hours ) {
				$lines[ $prev_row ]['days'][1] = $day_name;
				continue;
			}
			// Otherwise, create a new row
			$lines[ $i ] = ['days' => [$day_name], 'hours' => $today_hours];
			$prev_row = $i;
			$prev_hours = $today_hours;
		}
		
		// Return markup
		$formatted_hours = array_reduce( $lines, function( $html, $line ){
			return $html .= sprintf( '<dt>%s</dt><dd> %s</dd>', implode( '–', $line['days'] ), $line['hours'] );
		});
		if( !empty( $formatted_hours ) ) {
			$formatted_hours = sprintf( '<strong>%s</strong><dl>%s</dl>', 'Opening Hours:', $formatted_hours );
		}
		return $formatted_hours;
	}
	
}
