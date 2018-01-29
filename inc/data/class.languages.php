<?php
/**
 * Class for getting static information about languages
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @package Locations_Search\Data
 */

namespace Locations_Search\Data;
use Locations_Search as NS;

/**
 * Class for getting static information about languages
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
class Languages {
	
	/**
	 * Get full list of languages supported by the Google Maps API
	 * 
	 * Last updated: 22 jan 2018
	 * 
	 * @link https://developers.google.com/maps/faq#languagesupport
	 * @var array
	 */
	static public function get_all_gmaps_languages() {
		return [
			'ar' => 'Arabic',
			'bg' => 'Bulgarian',
			'bn' => 'Bengali',
			'ca' => 'Catalan',
			'cs' => 'Czech',
			'da' => 'Danish',
			'de' => 'German',
			'el' => 'Greek',
			'en' => 'English',
			'en-AU' => 'English (Australian)',
			'en-GB' => 'English (Great Britain)',
			'es' => 'Spanish',
			'eu' => 'Basque',
			'fa' => 'Farsi',
			'fi' => 'Finnish',
			'fil' => 'Filipino',
			'fr' => 'French',
			'gl' => 'Galician',
			'gu' => 'Gujarati',
			'hi' => 'Hindi',
			'hr' => 'Croatian',
			'hu' => 'Hungarian',
			'id' => 'Indonesian',
			'it' => 'Italian',
			'iw' => 'Hebrew',
			'ja' => 'Japanese',
			'kn' => 'Kannada',
			'ko' => 'Korean',
			'lt' => 'Lithuanian',
			'lv' => 'Latvian',
			'ml' => 'Malayalam',
			'mr' => 'Marathi',
			'nl' => 'Dutch',
			'no' => 'Norwegian',
			'pl' => 'Polish',
			'pt' => 'Portuguese',
			'pt-BR' => 'Portuguese (Brazil)',
			'pt-PT' => 'Portuguese (Portugal)',
			'ro' => 'Romanian',
			'ru' => 'Russian',
			'sk' => 'Slovak',
			'sl' => 'Slovenian',
			'sr' => 'Serbian',
			'sv' => 'Swedish',
			'ta' => 'Tamil',
			'te' => 'Telugu',
			'th' => 'Thai',
			'tl' => 'Tagalog',
			'tr' => 'Turkish',
			'uk' => 'Ukrainian',
			'vi' => 'Vietnamese',
			'zh-CN' => 'Chinese (Simplified)',
			'zh-TW' => 'Chinese (Traditional)',
		];
	}
	
	/**
	 * Get the name of a language based on its code
	 * 
	 * @param string $code
	 * @return false|string
	 */
	static public function get_gmaps_language_name( $code ) {
		$langs = self::get_all_gmaps_languages();
		return isset( $langs[ $code ] ) ? $langs[ $code ] : false;
	}
	
}
