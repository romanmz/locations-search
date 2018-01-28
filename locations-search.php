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
 * @package Locations_Search
 */

namespace Locations_Search;

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Define constants
define( 'Locations_Search\NS', __NAMESPACE__.'\\' );
define( 'Locations_Search\PLUGIN_NAME', 'locations-search' );
define( 'Locations_Search\PLUGIN_VERSION', '1.0.0' );
define( 'Locations_Search\PLUGIN_FILE', __FILE__ );
define( 'Locations_Search\PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'Locations_Search\PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'Locations_Search\PLUGIN_TEXT_DOMAIN', 'locations-search' );
define( 'Locations_Search\REQUIRED_PHP_VERSION', '5.6.0' );
define( 'Locations_Search\INCLUDES_DIR', PLUGIN_DIR.'inc/' );

// Load required files
require_once( PLUGIN_DIR.'inc/class.autoloader.php' );
require_once( PLUGIN_DIR.'inc/template-functions.php' );

// Initialize
new Core\Initializer();
