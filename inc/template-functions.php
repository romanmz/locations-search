<?php
/**
 * Functions for the templating system
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Functions
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Formats a line of text indicating the distance from a location
 * 
 * @param float $distance
 * @param string $distance_units
 * @return string
 */
function format_location_distance( $distance, $distance_units='km' ) {
	$formatted_distance = esc_html( sprintf(
		__( 'Distance: %1$s %2$s', 'locations-search' ),
		round( $distance, 1 ),
		$distance_units
	) );
	return $formatted_distance ? sprintf( '<div class="locsearch_distance">%s</div>', $formatted_distance ) : '';
}

if( !function_exists( 'get_location_address' ) ) {
	/**
	 * Returns a nicely formatted location address
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function get_location_address( $post_id=0 ) {
		
		// Check post ID
		$post_id = absint( $post_id );
		if( !$post_id ) $post_id = get_the_ID();
		if( get_post_type( $post_id ) !== 'location' ) return '';
		
		// Get post meta
		$meta_keys = ['address', 'address2', 'city', 'state', 'postcode', 'country'];
		foreach( $meta_keys as $meta_key ) {
			$$meta_key = trim( esc_html( get_post_meta( $post_id, $meta_key, true ) ) );
		}
		
		// Format full address
		$address_line_1 = $address;
		$address_line_2 = $address2;
		$address_line_3 = implode( ', ', array_filter( [$city, $state, $postcode, $country] ) );
		$full_address = implode( '<br>', array_filter( [$address_line_1, $address_line_2, $address_line_3] ) );
		
		// Return
		return $full_address ? sprintf( '<address class="locsearch_address">%s</address>', $full_address ) : '';
	}
}

if( !function_exists( 'the_location_address' ) ) {
	/**
	 * Outputs a nicely formatted location address
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function the_location_address( $post_id=0 ) {
		echo get_location_address( $post_id );
	}
}

if( !function_exists( 'get_location_details' ) ) {
	/**
	 * Returns a nicely formatted list of location details
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function get_location_details( $post_id=0 ) {
		
		// Check post ID
		$post_id = absint( $post_id );
		if( !$post_id ) $post_id = get_the_ID();
		if( get_post_type( $post_id ) !== 'location' ) return '';
		
		$details = [];
		// Phone
		$phone = esc_html( get_post_meta( $post_id, 'phone', true ) );
		if( $phone ) {
			$details[] = '<dt>Phone:</dt><dd><a href="tel:'.esc_attr( $phone ).'">'.$phone.'</a></dd>';
		}
		// Email
		$email = is_email( get_post_meta( $post_id, 'email', true ) );
		if( $email ) {
			$details[] = '<dt>Email:</dt><dd><a href="mailto:'.esc_attr( $email ).'">'.esc_html( $email ).'</a></dd>';
		}
		// Website
		$website_raw = get_post_meta( $post_id, 'website', true );
		$website = esc_url( $website_raw );
		if( $website ) {
			$details[] = '<dt>Website:</dt><dd><a href="'.esc_attr( $website ).'" target="_blank">'.esc_html( $website_raw ).'</a></dd>';
		}
		
		// Output
		$full_details = implode( '', $details );
		return $full_details ? sprintf( '<dl class="locsearch_details">%s</dl>', $full_details ) : '';
	}
}

if( !function_exists( 'the_location_details' ) ) {
	/**
	 * Outputs a nicely formatted list of location details
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function the_location_details( $post_id=0 ) {
		echo get_location_details( $post_id );
	}
}

if( !function_exists( 'get_location_hours' ) ) {
	/**
	 * Returns a nicely formatted list of opening hours for a location
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function get_location_hours( $post_id=0 ) {
		
		// Check post ID
		$post_id = absint( $post_id );
		if( !$post_id ) $post_id = get_the_ID();
		if( get_post_type( $post_id ) !== 'location' ) return '';
		
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
			return $html .= sprintf( '<dt>%s:</dt><dd>%s</dd>', implode( '–', $line['days'] ), $line['hours'] );
		});
		if( !empty( $formatted_hours ) ) {
			$formatted_hours = sprintf( '
				<div class="locsearch_hours">
					<div class="locsearch_subtitle">%s</div>
					<dl>%s</dl>
				</div>',
				esc_html__( 'Opening Hours', 'locations-search' ),
				$formatted_hours
			);
		}
		return $formatted_hours;
	}
}

if( !function_exists( 'the_location_hours' ) ) {
	/**
	 * Outputs a nicely formatted list of opening hours for a location
	 * 
	 * @param int $post_id
	 * @return string
	 */
	function the_location_hours( $post_id=0 ) {
		echo get_location_hours( $post_id );
	}
}
