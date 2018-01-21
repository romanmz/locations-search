<?php
/**
 * Plugin Name:         Locations Search
 * Plugin URI:          
 * Description:         Easily manage your locations database, and display maps on the frontend to allow users to search by location
 * Version:             1.0.0
 * Author:              Roman Martinez
 * Author URI:          https://www.romanmartinez.me
 * License:             GPL2+
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:         locations-search
 * Domain Path:         /languages/
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Main
 */

namespace Locations_Search;

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Define constants
define( __NAMESPACE__.'\NS', __NAMESPACE__.'\\' );
define( NS.'PLUGIN_NAME', 'locations-search' );
define( NS.'PLUGIN_VERSION', '1.0.0' );
define( NS.'PLUGIN_FILE', __FILE__ );
define( NS.'PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( NS.'PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( NS.'PLUGIN_TEXT_DOMAIN', 'locations-search' );
define( NS.'REQUIRED_PHP_VERSION', '5.6.0' );
define( NS.'INCLUDES_DIR', PLUGIN_DIR.'inc/' );

// Load required files
require_once( PLUGIN_DIR.'inc/core/class.autoloader.php' );

// Initialize
Core\Initializer::run();
