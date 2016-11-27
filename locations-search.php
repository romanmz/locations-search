<?php
/*
Plugin Name: Locations Search
Plugin URI:
Description: Create and search locations by keyword, postcode and categories
Author: Roman Martinez
Author URI: http://romanmartinez.me/
Version: 0.1.1
*/

// No direct access
defined( 'ABSPATH' ) or die( 'No direct access' );

// Define constants and static class
define( 'LOCATIONSSEARCHVERSION', '0.1.0' );
if( !class_exists( 'LocationsSearch' ) ) {
	class LocationsSearch {
		static public function get_url() {
			return plugins_url( '', __FILE__ );
		}
		static public function get_path() {
			return dirname( __FILE__ );
		}
		static public function get_main_file() {
			return __FILE__;
		}
		static public function get_country_codes() {
			return array(
				'af' => 'Afghanistan',
				'al' => 'Albania',
				'dz' => 'Algeria',
				'as' => 'American Samoa',
				'ad' => 'Andorra',
				'ai' => 'Anguilla',
				'ao' => 'Angola',
				'ag' => 'Antigua and Barbuda',
				'ar' => 'Argentina',
				'am' => 'Armenia',
				'aw' => 'Aruba',
				'au' => 'Australia',
				'at' => 'Austria',
				'az' => 'Azerbaijan',
				'bs' => 'Bahamas',
				'bh' => 'Bahrain',
				'bd' => 'Bangladesh',
				'bb' => 'Barbados',
				'by' => 'Belarus',
				'be' => 'Belgium',
				'bz' => 'Belize',
				'bj' => 'Benin',
				'bm' => 'Bermuda',
				'bt' => 'Bhutan',
				'bo' => 'Bolivia',
				'ba' => 'Bosnia and Herzegovina',
				'bw' => 'Botswana',
				'br' => 'Brazil',
				'io' => 'British Indian Ocean Territory',
				'bn' => 'Brunei',
				'bg' => 'Bulgaria',
				'bf' => 'Burkina Faso',
				'bi' => 'Burundi',
				'kh' => 'Cambodia',
				'cm' => 'Cameroon',
				'ca' => 'Canada',
				'cv' => 'Cape Verde',
				'ky' => 'Cayman Islands',
				'cf' => 'Central African Republic',
				'td' => 'Chad',
				'cl' => 'Chile',
				'cn' => 'China',
				'cx' => 'Christmas Island',
				'cc' => 'Cocos Islands',
				'co' => 'Colombia',
				'km' => 'Comoros',
				'cg' => 'Congo',
				'cr' => 'Costa Rica',
				'ci' => 'Côte d\'Ivoire',
				'hr' => 'Croatia',
				'cu' => 'Cuba',
				'cz' => 'Czech Republic',
				'dk' => 'Denmark',
				'dj' => 'Djibouti',
				'cd' => 'Democratic Republic of the Congo',
				'dm' => 'Dominica',
				'do' => 'Dominican Republic',
				'ec' => 'Ecuador',
				'eg' => 'Egypt',
				'sv' => 'El Salvador',
				'gq' => 'Equatorial Guinea',
				'er' => 'Eritrea',
				'ee' => 'Estonia',
				'et' => 'Ethiopia',
				'fj' => 'Fiji',
				'fi' => 'Finland',
				'fr' => 'France',
				'gf' => 'French Guiana',
				'ga' => 'Gabon',
				'gm' => 'Gambia',
				'de' => 'Germany',
				'gh' => 'Ghana',
				'gl' => 'Greenland',
				'gr' => 'Greece',
				'gd' => 'Grenada',
				'gu' => 'Guam',
				'gp' => 'Guadeloupe',
				'gt' => 'Guatemala',
				'gn' => 'Guinea',
				'gw' => 'Guinea-Bissau',
				'ht' => 'Haiti',
				'hn' => 'Honduras',
				'hk' => 'Hong Kong',
				'hu' => 'Hungary',
				'is' => 'Iceland',
				'in' => 'India',
				'id' => 'Indonesia',
				'ir' => 'Iran',
				'iq' => 'Iraq',
				'ie' => 'Ireland',
				'il' => 'Israel',
				'it' => 'Italy',
				'jm' => 'Jamaica',
				'jp' => 'Japan',
				'jo' => 'Jordan',
				'kz' => 'Kazakhstan',
				'ke' => 'Kenya',
				'kw' => 'Kuwait',
				'kg' => 'Kyrgyzstan',
				'la' => 'Laos',
				'lv' => 'Latvia',
				'lb' => 'Lebanon',
				'ls' => 'Lesotho',
				'lr' => 'Liberia',
				'ly' => 'Libya',
				'li' => 'Liechtenstein',
				'lt' => 'Lithuania',
				'lu' => 'Luxembourg',
				'mo' => 'Macau',
				'mk' => 'Macedonia',
				'mg' => 'Madagascar',
				'mw' => 'Malawi',
				'my' => 'Malaysia ',
				'ml' => 'Mali',
				'mh' => 'Marshall Islands',
				'il' => 'Martinique',
				'mr' => 'Mauritania',
				'mu' => 'Mauritius',
				'mx' => 'Mexico',
				'fm' => 'Micronesia',
				'md' => 'Moldova',
				'mc' => 'Monaco',
				'mn' => 'Mongolia',
				'me' => 'Montenegro',
				'ms' => 'Montserrat',
				'ma' => 'Morocco',
				'mz' => 'Mozambique',
				'mm' => 'Myanmar',
				'na' => 'Namibia',
				'nr' => 'Nauru',
				'np' => 'Nepal',
				'nl' => 'Netherlands',
				'an' => 'Netherlands Antilles',
				'nz' => 'New Zealand',
				'ni' => 'Nicaragua',
				'ne' => 'Niger',
				'ng' => 'Nigeria',
				'nu' => 'Niue',
				'mp' => 'Northern Mariana Islands',
				'no' => 'Norway',
				'om' => 'Oman',
				'pk' => 'Pakistan',
				'pa' => 'Panama',
				'pg' => 'Papua New Guinea',
				'py' => 'Paraguay',
				'pe' => 'Peru',
				'ph' => 'Philippines',
				'pn' => 'Pitcairn Islands',
				'pl' => 'Poland',
				'pt' => 'Portugal',
				'qa' => 'Qatar',
				're' => 'Reunion',
				'ro' => 'Romania',
				'ru' => 'Russia',
				'rw' => 'Rwanda',
				'sh' => 'Saint Helena',
				'kn' => 'Saint Kitts and Nevis',
				'vc' => 'Saint Vincent and the Grenadines',
				'lc' => 'Saint Lucia',
				'ws' => 'Samoa',
				'sm' => 'San Marino',
				'st' => 'São Tomé and Príncipe',
				'sa' => 'Saudi Arabia',
				'sn' => 'Senegal',
				'rs' => 'Serbia',
				'sc' => 'Seychelles',
				'sl' => 'Sierra Leone',
				'sg' => 'Singapore',
				'si' => 'Slovakia',
				'sb' => 'Solomon Islands',
				'so' => 'Somalia',
				'za' => 'South Africa',
				'kr' => 'South Korea',
				'es' => 'Spain',
				'lk' => 'Sri Lanka',
				'sd' => 'Sudan',
				'sz' => 'Swaziland',
				'se' => 'Sweden',
				'ch' => 'Switzerland',
				'sy' => 'Syria',
				'tw' => 'Taiwan',
				'tj' => 'Tajikistan',
				'tz' => 'Tanzania',
				'th' => 'Thailand',
				'tl' => 'Timor-Leste',
				'tk' => 'Tokelau',
				'tg' => 'Togo',
				'to' => 'Tonga',
				'tt' => 'Trinidad and Tobago',
				'tn' => 'Tunisia',
				'tr' => 'Turkey',
				'tm' => 'Turkmenistan',
				'tv' => 'Tuvalu',
				'ug' => 'Uganda',
				'ua' => 'Ukraine',
				'ae' => 'United Arab Emirates',
				'gb' => 'United Kingdom',
				'us' => 'United States',
				'uy' => 'Uruguay',
				'uz' => 'Uzbekistan',
				'wf' => 'Wallis Futuna',
				've' => 'Venezuela',
				'vn' => 'Vietnam',
				'ye' => 'Yemen',
				'zm' => 'Zambia',
				'zw' => 'Zimbabwe',
			);
		}
	}
}

// Load includes
require_once 'init-post-types.php';
require_once 'init-settings.php';
require_once 'model.php';
require_once 'views.php';
