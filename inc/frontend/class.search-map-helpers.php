<?php
/**
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Frontend
 */

namespace Locations_Search\Frontend;
use Locations_Search as NS;

/**
 * Helper functions for the interactive maps
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Search_Map_Helpers {
	
	/**
	 * Get attributes array for marker images
	 * 
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	static public function get_marker_attributes( $attachment_id, $max_size=40 ) {
		
		// Get image attributes
		$image_atts = self::get_image_size_attributes( $attachment_id, $max_size );
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
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	static public function get_cluster_attributes( $attachment_id, $max_size=40 ) {
		
		// Get image attributes
		$image_atts = self::get_image_size_attributes( $attachment_id, $max_size );
		if( !$image_atts ) {
			return false;
		}
		
		// Return data
		$cluster_atts = [
			[
				'url'                => $image_atts[0],
				'width'              => $image_atts[3],
				'height'             => $image_atts[4],
				'backgroundPosition' => 'center center; background-size: contain',
				// 'anchor'          => [ 0, 0 ],
				// 'textColor'       => '#FFFFFF',
				// 'textSize'        => 12,
			],
		];
		return $cluster_atts;
	}
	
	/**
	 * Get size attributes of an image
	 * 
	 * @param int $attachment_id
	 * @param int $max_size
	 * @return false|array
	 */
	static public function get_image_size_attributes( $attachment_id, $max_size=40 ) {
		
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
