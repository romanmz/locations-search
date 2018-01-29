<?php
/**
 * Autoloader Class
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Core
 */

namespace Locations_Search\Core;
use Locations_Search as NS;

/**
 * Autoloader Class
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class AutoLoader {
	
	/**
	 * Loads the file that corresponds to the passed class name
	 * 
	 * Only works for classes that belong to the same namespace as the plugin
	 * and if the class name matches the folder structure
	 * 
	 * @param string $class_name
	 * @return void
	 */
	public function load( $class_name ) {
		
		// Only take care of internal classes
		if( !$this->is_internal_class( $class_name ) ) {
			return;
		}
		
		// Split the full name into parts, use the class name as file name, and the namespaces as folder names
		$class_path = $this->format_as_path( $class_name );
		$folders = explode( '/', $class_path );
		array_shift( $folders );
		$file_name = array_pop( $folders );
		
		// Build the final path to the matching file
		$file_path = NS\INCLUDES_DIR;
		foreach( $folders as $folder ) {
			if( $folder == 'core' ) continue;
			$file_path .= $folder.'/';
		}
		$file_path .= 'class.'.$file_name.'.php';
		
		// Load file
		$this->load_file( $file_path );
	}
	
	/**
	 * Checks whether or not a given class belongs to this plugin
	 * 
	 * @param string $class_name
	 * @return bool
	 */
	public function is_internal_class( $class_name ) {
		return ( strpos( $class_name, NS\NS ) === 0 );
	}
	
	/**
	 * Updates a class name to match the formatting of the folder structure
	 * 
	 * @param string $class_name
	 * @return string
	 */
	public function format_as_path( $class_name ) {
		$class_name = strtolower( $class_name );
		$class_name = str_ireplace( ['_', '\\'], ['-', '/'], $class_name );
		return $class_name;
	}
	
	/**
	 * Attempts to load a given file
	 * 
	 * @param string $file_path
	 * @return void
	 */
	private function load_file( $file_path ) {
		if( !is_file( $file_path ) ) {
			$error_message = esc_html__( 'The file %s does not exist.', 'locations-search' );
			wp_die( sprintf( $error_message, esc_html( $file_path ) ) );
		} elseif( !is_readable( $file_path ) ) {
			$error_message = esc_html__( 'The file at %s is not readable.', 'locations-search' );
			wp_die( sprintf( $error_message, esc_html( $file_path ) ) );
		} else {
			include_once( $file_path );
		}
	}
	
}
spl_autoload_register( [new AutoLoader, 'load'] );
