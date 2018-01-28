/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(7);
__webpack_require__(8);
module.exports = __webpack_require__(9);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_locations_map_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__class_locations_geolocation_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__class_locations_geocoder_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__class_locations_database_js__ = __webpack_require__(6);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





jQuery(document).ready(function ($) {

	// Check Google Maps API
	if ((typeof google === 'undefined' ? 'undefined' : _typeof(google)) !== 'object') {
		alert(locsearch.alerts.api_unavailable);
		return;
	}

	// Generate locations maps
	$('.locsearch_map').each(function () {
		var map = new __WEBPACK_IMPORTED_MODULE_0__class_locations_map_js__["a" /* default */](this);
		map.addMarkersFromLocations($(this).data('locations'));
	});

	// Initialize search boxes
	$('.locsearch_box').each(function () {

		// Init objects
		// ------------------------------
		var box = $(this);
		var form = box.find('.locsearch_box__form');
		var messagesBox = box.find('.locsearch_box__messages');
		var resultsBox = box.find('.locsearch_box__results');
		var mapBox = box.find('.locsearch_box__map');
		var addressField = form.find('input[name=address]');
		var map = new __WEBPACK_IMPORTED_MODULE_0__class_locations_map_js__["a" /* default */](mapBox[0]);

		// Init functions
		// ------------------------------

		// Lock/unlock search box
		function lockSearch() {
			box.data('isLocked', true);
			box.addClass('locsearch_box--loading');
			box.find(':input').prop('disabled', true);
		}
		function unlockSearch() {
			box.data('isLocked', false);
			box.removeClass('locsearch_box--loading');
			box.find(':input').prop('disabled', false);
		}

		// Search database based on the user's current location
		function userLocationDetected(latLng) {
			databaseRequest(latLng.lat, latLng.lng, locsearch.map_attributes.search_radius, locsearch.text.your_location);
		}
		function requestUserLocation() {
			if (addressField.val().trim() == '') {
				__WEBPACK_IMPORTED_MODULE_1__class_locations_geolocation_js__["a" /* default */].requestLocation().then(userLocationDetected).catch(function (e) {});
			}
		}

		// Use geocoding to convert addresses into coordinates
		function geocodeRequest(address) {
			if (box.data('isLocked')) return;
			lockSearch();
			__WEBPACK_IMPORTED_MODULE_2__class_locations_geocoder_js__["a" /* default */].query(address).finally(unlockSearch).then(geocodeResponse).catch(function (e) {
				return alert('Error: ' + e.message);
			});
		}
		function geocodeResponse(results) {
			if (results.length === 1) {
				searchDatabaseFromGeocode(results[0]);
			} else if (results.length > 1) {
				showGeocodeAlternatives(results);
			}
		}
		function searchDatabaseFromGeocode(result) {
			databaseRequest(result.geometry.location.lat(), result.geometry.location.lng(), locsearch.map_attributes.search_radius, result.formatted_address);
		}
		function showGeocodeAlternatives(results) {
			messagesBox.html('<p>' + locsearch.text.did_you_mean + '</p>');
			var list = $('<ul>');
			results.forEach(function (result) {
				var item = $('<li>');
				var link = $('<a>', { href: '#', text: result.formatted_address });
				link.on('click', function (e) {
					e.preventDefault();
					searchDatabaseFromGeocode(result);
				});
				list.append(item.append(link));
			});
			messagesBox.append(list);
		}

		// Database results
		function databaseRequest(lat, lng, radius, referenceText) {
			var newRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

			if (box.data('isLocked')) return;
			lockSearch();
			messagesBox.html(referenceText ? '<p>' + locsearch.text.searching_near + ' ' + referenceText + '</p>' : '');

			// Draw a new radius area, and re-submit database query if the user resizes or moves the radius
			if (newRadius) {
				var mapRadius = map.drawRadius(lat, lng, radius);
				var onRadiusChange = function onRadiusChange() {
					databaseRequest(mapRadius.getCenter().lat(), mapRadius.getCenter().lng(), mapRadius.getRadius() / 1000, '', false);
				};
				google.maps.event.addListener(mapRadius, 'radius_changed', onRadiusChange);
				google.maps.event.addListener(mapRadius, 'center_changed', onRadiusChange);
			}

			// Submit database query
			__WEBPACK_IMPORTED_MODULE_3__class_locations_database_js__["a" /* default */].query(lat, lng, radius).finally(unlockSearch).then(databaseResponse).catch(function (e) {
				return alert('Error: ' + e.message);
			});
		}
		function databaseResponse(locations) {
			if (!locations.length) {
				messagesBox.append('<p>' + locsearch.text['0_results'] + '</p>');
			} else if (locations.length == 1) {
				messagesBox.append('<p>' + locsearch.text['1_result'] + '</p>');
			} else {
				messagesBox.append('<p>' + locsearch.text.many_results.replace('%s', locations.length) + '</p>');
			}
			map.addMarkersFromLocations(locations);

			// Update results list
			resultsBox.empty();
			locations.forEach(function (location) {
				if (!location.list_item) return;
				var listItem = $(location.list_item);
				resultsBox.append(listItem);
				google.maps.event.addListener(location.marker.marker, 'click', function () {
					resultsBox.animate({ scrollTop: resultsBox.scrollTop() + listItem.position().top });
					resultsBox.children('.locsearch_box__result').removeClass('locsearch_box__result--selected');
					listItem.addClass('locsearch_box__result--selected');
				});
				listItem.on('click', function (e) {
					if (e.target.nodeName.toLowerCase() == 'a') return;
					google.maps.event.trigger(location.marker.marker, 'click');
				});
			});
		}

		// Handle user actions
		// ------------------------------

		// Form submission
		form.on('submit', function (e) {
			e.preventDefault();
			geocodeRequest(addressField.val());
		});

		// Trigger automatic searches
		if (form.data('locsearch-autosearch')) {
			form.trigger('submit');
		} else if (__WEBPACK_IMPORTED_MODULE_1__class_locations_geolocation_js__["a" /* default */].cachedLocation) {
			userLocationDetected(__WEBPACK_IMPORTED_MODULE_1__class_locations_geolocation_js__["a" /* default */].cachedLocation);
		} else {
			requestUserLocation();
		}
	});
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_locations_map_marker_js__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var LocationsMap = function () {

	// Create map and set default attributes
	function LocationsMap(container) {
		_classCallCheck(this, LocationsMap);

		this.container = container;
		this.map = new google.maps.Map(container, {
			styles: locsearch.map_attributes.styles
		});
		this.markers = [];
		if (typeof MarkerClusterer === 'function' && locsearch.map_attributes.clusters_image) {
			this.markerClusterer = new MarkerClusterer(this.map, [], locsearch.map_attributes.clusters_image);
		} else {
			this.markerClusterer = null;
		}
		this.resetMapLocation();
	}

	// Sets the map to the default location


	_createClass(LocationsMap, [{
		key: 'resetMapLocation',
		value: function resetMapLocation() {
			this.map.setCenter({
				lat: locsearch.map_attributes.initial_lat,
				lng: locsearch.map_attributes.initial_lng
			});
			this.map.setZoom(locsearch.map_attributes.max_zoom);
		}

		// Enforce max zoom level

	}, {
		key: 'checkZoomLevel',
		value: function checkZoomLevel() {
			var newBounds = this.searchRadius ? this.searchRadius.getBounds() : new google.maps.LatLngBounds();
			this.markers.forEach(function (m) {
				newBounds.extend(m.marker.getPosition());
			});
			this.map.fitBounds(newBounds);
			if (this.map.getZoom() > locsearch.map_attributes.max_zoom) {
				this.map.setZoom(locsearch.map_attributes.max_zoom);
			}
		}

		// Create and add markers from a list of locations (deletes all previous markers)

	}, {
		key: 'addMarkersFromLocations',
		value: function addMarkersFromLocations(locations) {
			this.removeAllMarkers();
			this.markers = locations.map(this.addMarkerFromLocation.bind(this));
			this.checkZoomLevel();
		}
	}, {
		key: 'addMarkerFromLocation',
		value: function addMarkerFromLocation(location) {
			var newMarker = new __WEBPACK_IMPORTED_MODULE_0__class_locations_map_marker_js__["a" /* default */](this, location);
			if (this.markerClusterer) {
				this.markerClusterer.addMarker(newMarker.marker);
			}
			location.marker = newMarker;
			return newMarker;
		}

		// Delete all existing markers

	}, {
		key: 'removeAllMarkers',
		value: function removeAllMarkers() {
			this.markers.forEach(function (marker) {
				return marker.delete();
			});
			this.markers = [];
			if (this.markerClusterer) {
				this.markerClusterer.clearMarkers();
			}
		}

		// Draw search radius on the map

	}, {
		key: 'drawRadius',
		value: function drawRadius(lat, lng, radius) {
			if (this.searchRadius) {
				this.searchRadius.setMap(null);
			}
			this.searchRadius = new google.maps.Circle({
				strokeWeight: 1,
				strokeColor: '#FF0000',
				fillOpacity: 0,
				map: this.map,
				center: { lat: lat, lng: lng },
				radius: radius * 1000,
				editable: true
			});
			this.checkZoomLevel();
			google.maps.event.addListener(this.searchRadius, 'radius_changed', this.radiusResized.bind(this));
			google.maps.event.addListener(this.searchRadius, 'center_changed', this.radiusMoved.bind(this));
			return this.searchRadius;
		}

		// Callbacks after resizing or moving around the search area

	}, {
		key: 'radiusResized',
		value: function radiusResized() {
			if (this.searchRadius.getRadius() > locsearch.map_attributes.max_radius * 1000) {
				this.searchRadius.setRadius(locsearch.map_attributes.max_radius * 1000);
			}
			this.checkZoomLevel();
		}
	}, {
		key: 'radiusMoved',
		value: function radiusMoved() {
			this.checkZoomLevel();
		}
	}]);

	return LocationsMap;
}();

/* harmony default export */ __webpack_exports__["a"] = (LocationsMap);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationsMapMarker = function () {

	// Create marker and add it to the provided map
	function LocationsMapMarker(map, location) {
		_classCallCheck(this, LocationsMapMarker);

		this.map = map;
		this.location = location;
		this.position = { lat: location.lat, lng: location.lng };
		this.marker = new google.maps.Marker({
			map: map.map,
			position: new google.maps.LatLng(location.lat, location.lng),
			label: location.marker_label
		});
		this.infoWindow = this.addInfoWindow(location.info_window);
		this.deactivate();
		google.maps.event.addListener(this.marker, 'click', this.onClick.bind(this));
	}

	// Generates an 'info window' that opens when a user clicks on the marker


	_createClass(LocationsMapMarker, [{
		key: 'addInfoWindow',
		value: function addInfoWindow(content) {
			if (!content) {
				return null;
			}
			return new google.maps.InfoWindow({
				position: new google.maps.LatLng(this.position.lat, this.position.lng),
				content: content,
				pixelOffset: new google.maps.Size(0, -30)
			});
		}

		// Activates the marker

	}, {
		key: 'activate',
		value: function activate() {
			if (this.location.images.marker_active) {
				this.replaceIcon(this.location.images.marker_active);
			}
			if (this.infoWindow) {
				this.infoWindow.open(this.map.map);
			}
		}

		// Deactivates the marker

	}, {
		key: 'deactivate',
		value: function deactivate() {
			if (this.location.images.marker) {
				this.replaceIcon(this.location.images.marker);
			}
			if (this.infoWindow) {
				this.infoWindow.close();
			}
		}

		// Create and assign a new marker icon from the provided image data

	}, {
		key: 'replaceIcon',
		value: function replaceIcon(imageData) {
			var iconData = {
				url: imageData.url,
				size: new google.maps.Size(imageData.size[0], imageData.size[1]),
				scaledSize: new google.maps.Size(imageData.scaledSize[0], imageData.scaledSize[1]),
				origin: new google.maps.Point(imageData.origin[0], imageData.origin[1]),
				anchor: new google.maps.Point(imageData.anchor[0], imageData.anchor[1]),
				labelOrigin: new google.maps.Point(imageData.labelOrigin[0], imageData.labelOrigin[1])
			};
			this.marker.setIcon(iconData);
			if (this.infoWindow) {
				this.infoWindow.setOptions({
					pixelOffset: new google.maps.Size(0, iconData.scaledSize.height * -1)
				});
			}
		}

		// Delete self

	}, {
		key: 'delete',
		value: function _delete() {
			this.deactivate();
			this.marker.setMap(null);
		}

		// Trigger actions when the user clicks on the marker

	}, {
		key: 'onClick',
		value: function onClick() {
			this.map.markers.forEach(function (marker) {
				return marker.deactivate();
			});
			this.activate();
		}
	}]);

	return LocationsMapMarker;
}();

/* harmony default export */ __webpack_exports__["a"] = (LocationsMapMarker);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationsGeolocation = function () {
	function LocationsGeolocation() {
		_classCallCheck(this, LocationsGeolocation);
	}

	_createClass(LocationsGeolocation, null, [{
		key: 'requestLocation',


		// Detect the user's current location and cache it
		value: function requestLocation() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				navigator.geolocation.getCurrentPosition(function (location) {
					sessionStorage.setItem('userLat', location.coords.latitude);
					sessionStorage.setItem('userLng', location.coords.longitude);
					resolve(_this.cachedLocation);
				}, function (error) {
					reject(Error(error.message));
				}, {
					enableHighAccuracy: false,
					timeout: 10000,
					maximumAge: 0
				});
			});
		}
	}, {
		key: 'cachedLocation',


		// Return a previously saved user location
		get: function get() {
			if (sessionStorage.getItem('userLat') === null || sessionStorage.getItem('userLng') === null) {
				return null;
			}
			return {
				lat: parseFloat(sessionStorage.getItem('userLat')),
				lng: parseFloat(sessionStorage.getItem('userLng'))
			};
		}
	}]);

	return LocationsGeolocation;
}();

/* harmony default export */ __webpack_exports__["a"] = (LocationsGeolocation);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationsGeocoder = function () {
	function LocationsGeocoder() {
		_classCallCheck(this, LocationsGeocoder);
	}

	_createClass(LocationsGeocoder, null, [{
		key: 'reverseQuery',


		// reverse geocoding
		value: function reverseQuery(lat, lng) {}
		// let query = {}
		// query.location = new google.maps.LatLng( lat, lng );
		// query.placeId = string;


		// Submit geocoding query

	}, {
		key: 'query',
		value: function query(address) {
			var _this = this;

			return new Promise(function (resolve, reject) {

				// Prepare query
				var query = {};
				query.address = address.trim();
				// query.bounds
				query.componentRestrictions = {
					// route
					// locality
					// administrativeArea
					// postalCode
				};

				// Apply 'focus country' from user settings
				if (locsearch.map_attributes.focus_country && !locsearch.map_attributes.focus_strict) {
					query.region = locsearch.map_attributes.focus_country;
				}
				if (locsearch.map_attributes.focus_country && locsearch.map_attributes.focus_strict) {
					query.componentRestrictions.country = locsearch.map_attributes.focus_country;
				}

				// Validate query
				if (!query.address) {
					reject(Error(locsearch.alerts.empty_address));
				}

				// Send geocode request
				_this.geocoder.geocode(query, function (results, status) {
					if (status != 'OK') {
						reject(Error(_this.translateError(status)));
					}
					resolve(results);
				});
			});
		}

		// Check for errors in received data

	}, {
		key: 'translateError',
		value: function translateError(status) {
			if (status == 'INVALID_REQUEST') {
				return locsearch.alerts.invalid_request;
			} else if (status == 'OVER_QUERY_LIMIT') {
				return locsearch.alerts.query_limit;
			} else if (status == 'ZERO_RESULTS') {
				return locsearch.alerts.no_results;
			} else if (status != 'OK') {
				// UNKNOWN_ERROR and REQUEST_DENIED
				return locsearch.alerts.unknown_error;
			}
		}
	}, {
		key: 'geocoder',


		// Get geocoder object (initialize only once)
		get: function get() {
			delete this.geocoder;
			return this.geocoder = new google.maps.Geocoder();
		}
	}]);

	return LocationsGeocoder;
}();

/* harmony default export */ __webpack_exports__["a"] = (LocationsGeocoder);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationsDatabase = function () {
	function LocationsDatabase() {
		_classCallCheck(this, LocationsDatabase);
	}

	_createClass(LocationsDatabase, null, [{
		key: 'getGeocodeData',


		// Gets useful info from a geocode result to be used on the db query
		value: function getGeocodeData(result) {
			var db_fields = {
				'country': 'country',
				'administrative_area_level_1': 'state',
				'postal_code': 'postcode',
				'locality': 'city'
			};
			var result_type = result.types.find(function (type) {
				return db_fields[type];
			});
			if (result_type) {
				var result_data = result.address_components.find(function (component) {
					return component.types.includes(result_type);
				});
				return {
					code: result_data.short_name,
					name: result_data.long_name,
					field: db_fields[result_type]
				};
			}
			return null;
		}

		// Submit a database query

	}, {
		key: 'query',
		value: function query(lat, lng, radius) {
			return new Promise(function (resolve, reject) {

				// Prepare query
				var query = {
					'action': 'locations_map_search',
					lat: lat,
					lng: lng,
					search_radius: radius
				};

				if (typeof fetch == 'function') {
					// If fetch is available, use it
					var headers = new Headers({ 'Accept': 'application/json' });
					var formData = new FormData();
					for (var key in query) {
						if (query.hasOwnProperty(key)) {
							formData.append(key, query[key]);
						}
					}
					fetch(locsearch.ajax_url, { method: 'POST', headers: headers, body: formData }).then(function (result) {
						if (!result.ok) reject(Error(result.statusText));
						return result.json();
					}).then(resolve).catch(reject);
				} else {
					// Otherwise fallback to jQuery
					jQuery.post({
						url: locsearch.ajax_url,
						data: query,
						dataType: 'json',
						error: function error(jqXHR, status, _error) {
							reject(Error('Error: ' + _error));
						},
						success: function success(locations, status, jqXHR) {
							resolve(locations);
						}
					});
				}
			});
		}
	}]);

	return LocationsDatabase;
}();

/* harmony default export */ __webpack_exports__["a"] = (LocationsDatabase);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDIxNGQ0NWM0YWVjZjk4ZmFlYjAiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9qcy9zaG9ydGNvZGVzLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzP2VjNjciLCJ3ZWJwYWNrOi8vLy4vX3NyYy9zY3NzL2VkaXQtc2V0dGluZ3Muc2Nzcz82NTU0Iiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzU0ODAiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJnb29nbGUiLCJhbGVydCIsImxvY3NlYXJjaCIsImFsZXJ0cyIsImFwaV91bmF2YWlsYWJsZSIsImVhY2giLCJtYXAiLCJhZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyIsImRhdGEiLCJib3giLCJmb3JtIiwiZmluZCIsIm1lc3NhZ2VzQm94IiwicmVzdWx0c0JveCIsIm1hcEJveCIsImFkZHJlc3NGaWVsZCIsImxvY2tTZWFyY2giLCJhZGRDbGFzcyIsInByb3AiLCJ1bmxvY2tTZWFyY2giLCJyZW1vdmVDbGFzcyIsInVzZXJMb2NhdGlvbkRldGVjdGVkIiwibGF0TG5nIiwiZGF0YWJhc2VSZXF1ZXN0IiwibGF0IiwibG5nIiwibWFwX2F0dHJpYnV0ZXMiLCJzZWFyY2hfcmFkaXVzIiwidGV4dCIsInlvdXJfbG9jYXRpb24iLCJyZXF1ZXN0VXNlckxvY2F0aW9uIiwidmFsIiwidHJpbSIsIkxvY2F0aW9uc0dlb2xvY2F0aW9uIiwicmVxdWVzdExvY2F0aW9uIiwidGhlbiIsImNhdGNoIiwiZ2VvY29kZVJlcXVlc3QiLCJhZGRyZXNzIiwiTG9jYXRpb25zR2VvY29kZXIiLCJxdWVyeSIsImZpbmFsbHkiLCJnZW9jb2RlUmVzcG9uc2UiLCJlIiwibWVzc2FnZSIsInJlc3VsdHMiLCJsZW5ndGgiLCJzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlIiwic2hvd0dlb2NvZGVBbHRlcm5hdGl2ZXMiLCJyZXN1bHQiLCJnZW9tZXRyeSIsImxvY2F0aW9uIiwiZm9ybWF0dGVkX2FkZHJlc3MiLCJodG1sIiwiZGlkX3lvdV9tZWFuIiwibGlzdCIsImZvckVhY2giLCJpdGVtIiwibGluayIsImhyZWYiLCJvbiIsInByZXZlbnREZWZhdWx0IiwiYXBwZW5kIiwicmFkaXVzIiwicmVmZXJlbmNlVGV4dCIsIm5ld1JhZGl1cyIsInNlYXJjaGluZ19uZWFyIiwibWFwUmFkaXVzIiwiZHJhd1JhZGl1cyIsIm9uUmFkaXVzQ2hhbmdlIiwiZ2V0Q2VudGVyIiwiZ2V0UmFkaXVzIiwibWFwcyIsImV2ZW50IiwiYWRkTGlzdGVuZXIiLCJMb2NhdGlvbnNEYXRhYmFzZSIsImRhdGFiYXNlUmVzcG9uc2UiLCJsb2NhdGlvbnMiLCJtYW55X3Jlc3VsdHMiLCJyZXBsYWNlIiwiZW1wdHkiLCJsaXN0X2l0ZW0iLCJsaXN0SXRlbSIsIm1hcmtlciIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJwb3NpdGlvbiIsInRvcCIsImNoaWxkcmVuIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsInRyaWdnZXIiLCJjYWNoZWRMb2NhdGlvbiIsIkxvY2F0aW9uc01hcCIsImNvbnRhaW5lciIsIk1hcCIsInN0eWxlcyIsIm1hcmtlcnMiLCJNYXJrZXJDbHVzdGVyZXIiLCJjbHVzdGVyc19pbWFnZSIsIm1hcmtlckNsdXN0ZXJlciIsInJlc2V0TWFwTG9jYXRpb24iLCJzZXRDZW50ZXIiLCJpbml0aWFsX2xhdCIsImluaXRpYWxfbG5nIiwic2V0Wm9vbSIsIm1heF96b29tIiwibmV3Qm91bmRzIiwic2VhcmNoUmFkaXVzIiwiZ2V0Qm91bmRzIiwiTGF0TG5nQm91bmRzIiwiZXh0ZW5kIiwibSIsImdldFBvc2l0aW9uIiwiZml0Qm91bmRzIiwiZ2V0Wm9vbSIsInJlbW92ZUFsbE1hcmtlcnMiLCJhZGRNYXJrZXJGcm9tTG9jYXRpb24iLCJiaW5kIiwiY2hlY2tab29tTGV2ZWwiLCJuZXdNYXJrZXIiLCJhZGRNYXJrZXIiLCJkZWxldGUiLCJjbGVhck1hcmtlcnMiLCJzZXRNYXAiLCJDaXJjbGUiLCJzdHJva2VXZWlnaHQiLCJzdHJva2VDb2xvciIsImZpbGxPcGFjaXR5IiwiY2VudGVyIiwiZWRpdGFibGUiLCJyYWRpdXNSZXNpemVkIiwicmFkaXVzTW92ZWQiLCJtYXhfcmFkaXVzIiwic2V0UmFkaXVzIiwiTG9jYXRpb25zTWFwTWFya2VyIiwiTWFya2VyIiwiTGF0TG5nIiwibGFiZWwiLCJtYXJrZXJfbGFiZWwiLCJpbmZvV2luZG93IiwiYWRkSW5mb1dpbmRvdyIsImluZm9fd2luZG93IiwiZGVhY3RpdmF0ZSIsIm9uQ2xpY2siLCJjb250ZW50IiwiSW5mb1dpbmRvdyIsInBpeGVsT2Zmc2V0IiwiU2l6ZSIsImltYWdlcyIsIm1hcmtlcl9hY3RpdmUiLCJyZXBsYWNlSWNvbiIsIm9wZW4iLCJjbG9zZSIsImltYWdlRGF0YSIsImljb25EYXRhIiwidXJsIiwic2l6ZSIsInNjYWxlZFNpemUiLCJvcmlnaW4iLCJQb2ludCIsImFuY2hvciIsImxhYmVsT3JpZ2luIiwic2V0SWNvbiIsInNldE9wdGlvbnMiLCJoZWlnaHQiLCJhY3RpdmF0ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJzZXNzaW9uU3RvcmFnZSIsInNldEl0ZW0iLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIkVycm9yIiwiZXJyb3IiLCJlbmFibGVIaWdoQWNjdXJhY3kiLCJ0aW1lb3V0IiwibWF4aW11bUFnZSIsImdldEl0ZW0iLCJwYXJzZUZsb2F0IiwiY29tcG9uZW50UmVzdHJpY3Rpb25zIiwiZm9jdXNfY291bnRyeSIsImZvY3VzX3N0cmljdCIsInJlZ2lvbiIsImNvdW50cnkiLCJlbXB0eV9hZGRyZXNzIiwiZ2VvY29kZXIiLCJnZW9jb2RlIiwic3RhdHVzIiwidHJhbnNsYXRlRXJyb3IiLCJpbnZhbGlkX3JlcXVlc3QiLCJxdWVyeV9saW1pdCIsIm5vX3Jlc3VsdHMiLCJ1bmtub3duX2Vycm9yIiwiR2VvY29kZXIiLCJkYl9maWVsZHMiLCJyZXN1bHRfdHlwZSIsInR5cGVzIiwidHlwZSIsInJlc3VsdF9kYXRhIiwiYWRkcmVzc19jb21wb25lbnRzIiwiY29tcG9uZW50IiwiaW5jbHVkZXMiLCJjb2RlIiwic2hvcnRfbmFtZSIsIm5hbWUiLCJsb25nX25hbWUiLCJmaWVsZCIsImZldGNoIiwiaGVhZGVycyIsIkhlYWRlcnMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJhamF4X3VybCIsIm1ldGhvZCIsImJvZHkiLCJvayIsInN0YXR1c1RleHQiLCJqc29uIiwicG9zdCIsImRhdGFUeXBlIiwianFYSFIiLCJzdWNjZXNzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4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SEM7QUFJWGhELGFBQU8sZUFBVWlELEtBQVYsRUFBaUJuQyxNQUFqQixFQUF5QmQsTUFBekIsRUFBaUM7QUFDdkNWLGNBQVFTLGtCQUFpQkMsTUFBakIsQ0FBUjtBQUNBLE9BTlU7QUFPWGtELGVBQVMsaUJBQVV6SixTQUFWLEVBQXFCcUgsTUFBckIsRUFBNkJtQyxLQUE3QixFQUFxQztBQUM3QzVELGVBQVM1RixTQUFUO0FBQ0E7QUFUVSxNQUFaO0FBV0E7QUFFRCxJQXhDTSxDQUFQO0FBeUNBOzs7Ozs7eURBakVtQkYsaUI7Ozs7OztBQ0FyQix5Qzs7Ozs7O0FDQUEseUM7Ozs7OztBQ0FBLHlDIiwiZmlsZSI6Ii9hc3NldHMvanMvc2hvcnRjb2Rlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQyMTRkNDVjNGFlY2Y5OGZhZWIwIiwiaW1wb3J0IExvY2F0aW9uc01hcCBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1tYXAuanMnO1xuaW1wb3J0IExvY2F0aW9uc0dlb2xvY2F0aW9uIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzJztcbmltcG9ydCBMb2NhdGlvbnNHZW9jb2RlciBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1nZW9jb2Rlci5qcyc7XG5pbXBvcnQgTG9jYXRpb25zRGF0YWJhc2UgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtZGF0YWJhc2UuanMnO1xualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKXtcblx0XG5cdC8vIENoZWNrIEdvb2dsZSBNYXBzIEFQSVxuXHRpZiggdHlwZW9mIGdvb2dsZSAhPT0gJ29iamVjdCcgKSB7XG5cdFx0YWxlcnQoIGxvY3NlYXJjaC5hbGVydHMuYXBpX3VuYXZhaWxhYmxlICk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdFxuXHQvLyBHZW5lcmF0ZSBsb2NhdGlvbnMgbWFwc1xuXHQkKCcubG9jc2VhcmNoX21hcCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRsZXQgbWFwID0gbmV3IExvY2F0aW9uc01hcCggdGhpcyApO1xuXHRcdG1hcC5hZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyggJCh0aGlzKS5kYXRhKCdsb2NhdGlvbnMnKSApO1xuXHR9KTtcblx0XG5cdC8vIEluaXRpYWxpemUgc2VhcmNoIGJveGVzXG5cdCQoJy5sb2NzZWFyY2hfYm94JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFxuXHRcdFxuXHRcdC8vIEluaXQgb2JqZWN0c1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdGxldCBib3ggPSAkKHRoaXMpO1xuXHRcdGxldCBmb3JtID0gYm94LmZpbmQoJy5sb2NzZWFyY2hfYm94X19mb3JtJyk7XG5cdFx0bGV0IG1lc3NhZ2VzQm94ID0gYm94LmZpbmQoJy5sb2NzZWFyY2hfYm94X19tZXNzYWdlcycpO1xuXHRcdGxldCByZXN1bHRzQm94ID0gYm94LmZpbmQoJy5sb2NzZWFyY2hfYm94X19yZXN1bHRzJyk7XG5cdFx0bGV0IG1hcEJveCA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fbWFwJyk7XG5cdFx0bGV0IGFkZHJlc3NGaWVsZCA9IGZvcm0uZmluZCggJ2lucHV0W25hbWU9YWRkcmVzc10nICk7XG5cdFx0bGV0IG1hcCA9IG5ldyBMb2NhdGlvbnNNYXAoIG1hcEJveFswXSApO1xuXHRcdFxuXHRcdFxuXHRcdC8vIEluaXQgZnVuY3Rpb25zXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0Ly8gTG9jay91bmxvY2sgc2VhcmNoIGJveFxuXHRcdGZ1bmN0aW9uIGxvY2tTZWFyY2goKSB7XG5cdFx0XHRib3guZGF0YSggJ2lzTG9ja2VkJywgdHJ1ZSApO1xuXHRcdFx0Ym94LmFkZENsYXNzKCAnbG9jc2VhcmNoX2JveC0tbG9hZGluZycgKTtcblx0XHRcdGJveC5maW5kKCAnOmlucHV0JyApLnByb3AoICdkaXNhYmxlZCcsIHRydWUgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdW5sb2NrU2VhcmNoKCkge1xuXHRcdFx0Ym94LmRhdGEoICdpc0xvY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRib3gucmVtb3ZlQ2xhc3MoICdsb2NzZWFyY2hfYm94LS1sb2FkaW5nJyApO1xuXHRcdFx0Ym94LmZpbmQoICc6aW5wdXQnICkucHJvcCggJ2Rpc2FibGVkJywgZmFsc2UgKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gU2VhcmNoIGRhdGFiYXNlIGJhc2VkIG9uIHRoZSB1c2VyJ3MgY3VycmVudCBsb2NhdGlvblxuXHRcdGZ1bmN0aW9uIHVzZXJMb2NhdGlvbkRldGVjdGVkKCBsYXRMbmcgKSB7XG5cdFx0XHRkYXRhYmFzZVJlcXVlc3QoIGxhdExuZy5sYXQsIGxhdExuZy5sbmcsIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5zZWFyY2hfcmFkaXVzLCBsb2NzZWFyY2gudGV4dC55b3VyX2xvY2F0aW9uICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlcXVlc3RVc2VyTG9jYXRpb24oKSB7XG5cdFx0XHRpZiggYWRkcmVzc0ZpZWxkLnZhbCgpLnRyaW0oKSA9PSAnJyApIHtcblx0XHRcdFx0TG9jYXRpb25zR2VvbG9jYXRpb24ucmVxdWVzdExvY2F0aW9uKClcblx0XHRcdFx0XHQudGhlbiggdXNlckxvY2F0aW9uRGV0ZWN0ZWQgKVxuXHRcdFx0XHRcdC5jYXRjaCggZT0+e30gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0Ly8gVXNlIGdlb2NvZGluZyB0byBjb252ZXJ0IGFkZHJlc3NlcyBpbnRvIGNvb3JkaW5hdGVzXG5cdFx0ZnVuY3Rpb24gZ2VvY29kZVJlcXVlc3QoIGFkZHJlc3MgKSB7XG5cdFx0XHRpZiggYm94LmRhdGEoICdpc0xvY2tlZCcgKSApIHJldHVybjtcblx0XHRcdGxvY2tTZWFyY2goKTtcblx0XHRcdExvY2F0aW9uc0dlb2NvZGVyLnF1ZXJ5KCBhZGRyZXNzIClcblx0XHRcdFx0LmZpbmFsbHkoIHVubG9ja1NlYXJjaCApXG5cdFx0XHRcdC50aGVuKCBnZW9jb2RlUmVzcG9uc2UgKVxuXHRcdFx0XHQuY2F0Y2goIGUgPT4gYWxlcnQoIGBFcnJvcjogJHtlLm1lc3NhZ2V9YCApICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdlb2NvZGVSZXNwb25zZSggcmVzdWx0cyApIHtcblx0XHRcdGlmKCByZXN1bHRzLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdFx0c2VhcmNoRGF0YWJhc2VGcm9tR2VvY29kZSggcmVzdWx0c1swXSApO1xuXHRcdFx0fSBlbHNlIGlmKCByZXN1bHRzLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdHNob3dHZW9jb2RlQWx0ZXJuYXRpdmVzKCByZXN1bHRzICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlYXJjaERhdGFiYXNlRnJvbUdlb2NvZGUoIHJlc3VsdCApIHtcblx0XHRcdGRhdGFiYXNlUmVxdWVzdCggcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxhdCgpLCByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubG5nKCksIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5zZWFyY2hfcmFkaXVzLCByZXN1bHQuZm9ybWF0dGVkX2FkZHJlc3MgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2hvd0dlb2NvZGVBbHRlcm5hdGl2ZXMoIHJlc3VsdHMgKSB7XG5cdFx0XHRtZXNzYWdlc0JveC5odG1sKCAnPHA+Jytsb2NzZWFyY2gudGV4dC5kaWRfeW91X21lYW4rJzwvcD4nICk7XG5cdFx0XHRsZXQgbGlzdCA9ICQoJzx1bD4nKTtcblx0XHRcdHJlc3VsdHMuZm9yRWFjaCggcmVzdWx0ID0+IHtcblx0XHRcdFx0bGV0IGl0ZW0gPSAkKCc8bGk+Jyk7XG5cdFx0XHRcdGxldCBsaW5rID0gJCgnPGE+Jyx7IGhyZWY6ICcjJywgdGV4dDogcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzIH0pO1xuXHRcdFx0XHRsaW5rLm9uKCAnY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlKCByZXN1bHQgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGxpc3QuYXBwZW5kKCBpdGVtLmFwcGVuZCggbGluayApICk7XG5cdFx0XHR9KTtcblx0XHRcdG1lc3NhZ2VzQm94LmFwcGVuZCggbGlzdCApO1xuXHRcdH1cblx0XHRcblx0XHQvLyBEYXRhYmFzZSByZXN1bHRzXG5cdFx0ZnVuY3Rpb24gZGF0YWJhc2VSZXF1ZXN0KCBsYXQsIGxuZywgcmFkaXVzLCByZWZlcmVuY2VUZXh0LCBuZXdSYWRpdXM9dHJ1ZSApIHtcblx0XHRcdGlmKCBib3guZGF0YSggJ2lzTG9ja2VkJyApICkgcmV0dXJuO1xuXHRcdFx0bG9ja1NlYXJjaCgpO1xuXHRcdFx0bWVzc2FnZXNCb3guaHRtbCggcmVmZXJlbmNlVGV4dCA/IGA8cD4ke2xvY3NlYXJjaC50ZXh0LnNlYXJjaGluZ19uZWFyfSAke3JlZmVyZW5jZVRleHR9PC9wPmAgOiAnJyApO1xuXHRcdFx0XG5cdFx0XHQvLyBEcmF3IGEgbmV3IHJhZGl1cyBhcmVhLCBhbmQgcmUtc3VibWl0IGRhdGFiYXNlIHF1ZXJ5IGlmIHRoZSB1c2VyIHJlc2l6ZXMgb3IgbW92ZXMgdGhlIHJhZGl1c1xuXHRcdFx0aWYoIG5ld1JhZGl1cyApIHtcblx0XHRcdFx0bGV0IG1hcFJhZGl1cyA9IG1hcC5kcmF3UmFkaXVzKCBsYXQsIGxuZywgcmFkaXVzICk7XG5cdFx0XHRcdGxldCBvblJhZGl1c0NoYW5nZSA9ICgpPT57XG5cdFx0XHRcdFx0ZGF0YWJhc2VSZXF1ZXN0KCBtYXBSYWRpdXMuZ2V0Q2VudGVyKCkubGF0KCksIG1hcFJhZGl1cy5nZXRDZW50ZXIoKS5sbmcoKSwgbWFwUmFkaXVzLmdldFJhZGl1cygpLzEwMDAsICcnLCBmYWxzZSApO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggbWFwUmFkaXVzLCAncmFkaXVzX2NoYW5nZWQnLCBvblJhZGl1c0NoYW5nZSApO1xuXHRcdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggbWFwUmFkaXVzLCAnY2VudGVyX2NoYW5nZWQnLCBvblJhZGl1c0NoYW5nZSApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBTdWJtaXQgZGF0YWJhc2UgcXVlcnlcblx0XHRcdExvY2F0aW9uc0RhdGFiYXNlLnF1ZXJ5KCBsYXQsIGxuZywgcmFkaXVzIClcblx0XHRcdFx0LmZpbmFsbHkoIHVubG9ja1NlYXJjaCApXG5cdFx0XHRcdC50aGVuKCBkYXRhYmFzZVJlc3BvbnNlIClcblx0XHRcdFx0LmNhdGNoKCBlID0+IGFsZXJ0KCBgRXJyb3I6ICR7ZS5tZXNzYWdlfWAgKSApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkYXRhYmFzZVJlc3BvbnNlKCBsb2NhdGlvbnMgKSB7XG5cdFx0XHRpZiggIWxvY2F0aW9ucy5sZW5ndGggKSB7XG5cdFx0XHRcdG1lc3NhZ2VzQm94LmFwcGVuZCggJzxwPicrbG9jc2VhcmNoLnRleHRbJzBfcmVzdWx0cyddKyc8L3A+JyApO1xuXHRcdFx0fSBlbHNlIGlmKCBsb2NhdGlvbnMubGVuZ3RoID09IDEgKSB7XG5cdFx0XHRcdG1lc3NhZ2VzQm94LmFwcGVuZCggJzxwPicrbG9jc2VhcmNoLnRleHRbJzFfcmVzdWx0J10rJzwvcD4nICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoICc8cD4nK2xvY3NlYXJjaC50ZXh0Lm1hbnlfcmVzdWx0cy5yZXBsYWNlKCAnJXMnLCBsb2NhdGlvbnMubGVuZ3RoICkgKyc8L3A+JyApO1xuXHRcdFx0fVxuXHRcdFx0bWFwLmFkZE1hcmtlcnNGcm9tTG9jYXRpb25zKCBsb2NhdGlvbnMgKTtcblx0XHRcdFxuXHRcdFx0Ly8gVXBkYXRlIHJlc3VsdHMgbGlzdFxuXHRcdFx0cmVzdWx0c0JveC5lbXB0eSgpO1xuXHRcdFx0bG9jYXRpb25zLmZvckVhY2goIGxvY2F0aW9uID0+IHtcblx0XHRcdFx0aWYoICFsb2NhdGlvbi5saXN0X2l0ZW0gKSByZXR1cm47XG5cdFx0XHRcdGxldCBsaXN0SXRlbSA9ICQobG9jYXRpb24ubGlzdF9pdGVtKTtcblx0XHRcdFx0cmVzdWx0c0JveC5hcHBlbmQoIGxpc3RJdGVtICk7XG5cdFx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCBsb2NhdGlvbi5tYXJrZXIubWFya2VyLCAnY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdFx0cmVzdWx0c0JveC5hbmltYXRlKHsgc2Nyb2xsVG9wOiByZXN1bHRzQm94LnNjcm9sbFRvcCgpICsgbGlzdEl0ZW0ucG9zaXRpb24oKS50b3AgfSk7XG5cdFx0XHRcdFx0cmVzdWx0c0JveC5jaGlsZHJlbiggJy5sb2NzZWFyY2hfYm94X19yZXN1bHQnICkucmVtb3ZlQ2xhc3MoICdsb2NzZWFyY2hfYm94X19yZXN1bHQtLXNlbGVjdGVkJyApO1xuXHRcdFx0XHRcdGxpc3RJdGVtLmFkZENsYXNzKCAnbG9jc2VhcmNoX2JveF9fcmVzdWx0LS1zZWxlY3RlZCcgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGxpc3RJdGVtLm9uKCAnY2xpY2snLCBlID0+IHtcblx0XHRcdFx0XHRpZiggZS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PSAnYScgKSByZXR1cm47XG5cdFx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlciggbG9jYXRpb24ubWFya2VyLm1hcmtlciwgJ2NsaWNrJyApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHRcblx0XHQvLyBIYW5kbGUgdXNlciBhY3Rpb25zXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0Ly8gRm9ybSBzdWJtaXNzaW9uXG5cdFx0Zm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Z2VvY29kZVJlcXVlc3QoIGFkZHJlc3NGaWVsZC52YWwoKSApO1xuXHRcdH0pO1xuXHRcdFxuXHRcdC8vIFRyaWdnZXIgYXV0b21hdGljIHNlYXJjaGVzXG5cdFx0aWYoIGZvcm0uZGF0YSggJ2xvY3NlYXJjaC1hdXRvc2VhcmNoJyApICkge1xuXHRcdFx0Zm9ybS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdH0gZWxzZSBpZiggTG9jYXRpb25zR2VvbG9jYXRpb24uY2FjaGVkTG9jYXRpb24gKSB7XG5cdFx0XHR1c2VyTG9jYXRpb25EZXRlY3RlZCggTG9jYXRpb25zR2VvbG9jYXRpb24uY2FjaGVkTG9jYXRpb24gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVxdWVzdFVzZXJMb2NhdGlvbigpO1xuXHRcdH1cblx0XHRcblx0XHRcblx0fSk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvc2hvcnRjb2Rlcy5qcyIsImltcG9ydCBMb2NhdGlvbnNNYXBNYXJrZXIgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtbWFwLW1hcmtlci5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNNYXAge1xuXHRcblx0Ly8gQ3JlYXRlIG1hcCBhbmQgc2V0IGRlZmF1bHQgYXR0cmlidXRlc1xuXHRjb25zdHJ1Y3RvciggY29udGFpbmVyICkge1xuXHRcdHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXHRcdHRoaXMubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCggY29udGFpbmVyLCB7XG5cdFx0XHRzdHlsZXM6IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5zdHlsZXMsXG5cdFx0fSk7XG5cdFx0dGhpcy5tYXJrZXJzID0gW107XG5cdFx0aWYoIHR5cGVvZiBNYXJrZXJDbHVzdGVyZXIgPT09ICdmdW5jdGlvbicgJiYgbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmNsdXN0ZXJzX2ltYWdlICkge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBuZXcgTWFya2VyQ2x1c3RlcmVyKCB0aGlzLm1hcCwgW10sIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5jbHVzdGVyc19pbWFnZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlciA9IG51bGw7XG5cdFx0fVxuXHRcdHRoaXMucmVzZXRNYXBMb2NhdGlvbigpO1xuXHR9XG5cdFxuXHQvLyBTZXRzIHRoZSBtYXAgdG8gdGhlIGRlZmF1bHQgbG9jYXRpb25cblx0cmVzZXRNYXBMb2NhdGlvbigpIHtcblx0XHR0aGlzLm1hcC5zZXRDZW50ZXIoe1xuXHRcdFx0bGF0OiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuaW5pdGlhbF9sYXQsXG5cdFx0XHRsbmc6IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5pbml0aWFsX2xuZyxcblx0XHR9KTtcblx0XHR0aGlzLm1hcC5zZXRab29tKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3pvb20gKTtcblx0fVxuXHRcblx0Ly8gRW5mb3JjZSBtYXggem9vbSBsZXZlbFxuXHRjaGVja1pvb21MZXZlbCgpIHtcblx0XHRsZXQgbmV3Qm91bmRzID0gdGhpcy5zZWFyY2hSYWRpdXMgPyB0aGlzLnNlYXJjaFJhZGl1cy5nZXRCb3VuZHMoKSA6IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcblx0XHR0aGlzLm1hcmtlcnMuZm9yRWFjaCggbSA9PiB7IG5ld0JvdW5kcy5leHRlbmQoIG0ubWFya2VyLmdldFBvc2l0aW9uKCkgKSB9ICk7XG5cdFx0dGhpcy5tYXAuZml0Qm91bmRzKCBuZXdCb3VuZHMgKTtcblx0XHRpZiggdGhpcy5tYXAuZ2V0Wm9vbSgpID4gbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF96b29tICkge1xuXHRcdFx0dGhpcy5tYXAuc2V0Wm9vbSggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF96b29tICk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBDcmVhdGUgYW5kIGFkZCBtYXJrZXJzIGZyb20gYSBsaXN0IG9mIGxvY2F0aW9ucyAoZGVsZXRlcyBhbGwgcHJldmlvdXMgbWFya2Vycylcblx0YWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMoIGxvY2F0aW9ucyApIHtcblx0XHR0aGlzLnJlbW92ZUFsbE1hcmtlcnMoKTtcblx0XHR0aGlzLm1hcmtlcnMgPSBsb2NhdGlvbnMubWFwKCB0aGlzLmFkZE1hcmtlckZyb21Mb2NhdGlvbi5iaW5kKCB0aGlzICkgKTtcblx0XHR0aGlzLmNoZWNrWm9vbUxldmVsKCk7XG5cdH1cblx0YWRkTWFya2VyRnJvbUxvY2F0aW9uKCBsb2NhdGlvbiApIHtcblx0XHRsZXQgbmV3TWFya2VyID0gbmV3IExvY2F0aW9uc01hcE1hcmtlciggdGhpcywgbG9jYXRpb24gKTtcblx0XHRpZiggdGhpcy5tYXJrZXJDbHVzdGVyZXIgKSB7XG5cdFx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXIoIG5ld01hcmtlci5tYXJrZXIgKTtcblx0XHR9XG5cdFx0bG9jYXRpb24ubWFya2VyID0gbmV3TWFya2VyO1xuXHRcdHJldHVybiBuZXdNYXJrZXI7XG5cdH1cblx0XG5cdC8vIERlbGV0ZSBhbGwgZXhpc3RpbmcgbWFya2Vyc1xuXHRyZW1vdmVBbGxNYXJrZXJzKCkge1xuXHRcdHRoaXMubWFya2Vycy5mb3JFYWNoKCBtYXJrZXIgPT4gbWFya2VyLmRlbGV0ZSgpICk7XG5cdFx0dGhpcy5tYXJrZXJzID0gW107XG5cdFx0aWYoIHRoaXMubWFya2VyQ2x1c3RlcmVyICkge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIuY2xlYXJNYXJrZXJzKCk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBEcmF3IHNlYXJjaCByYWRpdXMgb24gdGhlIG1hcFxuXHRkcmF3UmFkaXVzKCBsYXQsIGxuZywgcmFkaXVzICkge1xuXHRcdGlmKCB0aGlzLnNlYXJjaFJhZGl1cyApIHtcblx0XHRcdHRoaXMuc2VhcmNoUmFkaXVzLnNldE1hcCggbnVsbCApO1xuXHRcdH1cblx0XHR0aGlzLnNlYXJjaFJhZGl1cyA9IG5ldyBnb29nbGUubWFwcy5DaXJjbGUoe1xuXHRcdFx0c3Ryb2tlV2VpZ2h0OiAxLFxuXHRcdFx0c3Ryb2tlQ29sb3I6ICcjRkYwMDAwJyxcblx0XHRcdGZpbGxPcGFjaXR5OiAwLFxuXHRcdFx0bWFwOiB0aGlzLm1hcCxcblx0XHRcdGNlbnRlcjoge2xhdCwgbG5nfSxcblx0XHRcdHJhZGl1czogcmFkaXVzICogMTAwMCxcblx0XHRcdGVkaXRhYmxlOiB0cnVlLFxuXHRcdH0pO1xuXHRcdHRoaXMuY2hlY2tab29tTGV2ZWwoKTtcblx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggdGhpcy5zZWFyY2hSYWRpdXMsICdyYWRpdXNfY2hhbmdlZCcsIHRoaXMucmFkaXVzUmVzaXplZC5iaW5kKCB0aGlzICkgKTtcblx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggdGhpcy5zZWFyY2hSYWRpdXMsICdjZW50ZXJfY2hhbmdlZCcsIHRoaXMucmFkaXVzTW92ZWQuYmluZCggdGhpcyApICk7XG5cdFx0cmV0dXJuIHRoaXMuc2VhcmNoUmFkaXVzO1xuXHR9XG5cdFxuXHQvLyBDYWxsYmFja3MgYWZ0ZXIgcmVzaXppbmcgb3IgbW92aW5nIGFyb3VuZCB0aGUgc2VhcmNoIGFyZWFcblx0cmFkaXVzUmVzaXplZCgpIHtcblx0XHRpZiggdGhpcy5zZWFyY2hSYWRpdXMuZ2V0UmFkaXVzKCkgPiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3JhZGl1cyAqIDEwMDAgKSB7XG5cdFx0XHR0aGlzLnNlYXJjaFJhZGl1cy5zZXRSYWRpdXMoIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfcmFkaXVzICogMTAwMCApO1xuXHRcdH1cblx0XHR0aGlzLmNoZWNrWm9vbUxldmVsKCk7XG5cdH1cblx0cmFkaXVzTW92ZWQoKSB7XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHR9XG5cdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9jbGFzcy5sb2NhdGlvbnMtbWFwLmpzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zTWFwTWFya2VyIHtcblx0XG5cdC8vIENyZWF0ZSBtYXJrZXIgYW5kIGFkZCBpdCB0byB0aGUgcHJvdmlkZWQgbWFwXG5cdGNvbnN0cnVjdG9yKCBtYXAsIGxvY2F0aW9uICkge1xuXHRcdHRoaXMubWFwID0gbWFwO1xuXHRcdHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbjtcblx0XHR0aGlzLnBvc2l0aW9uID0geyBsYXQ6IGxvY2F0aW9uLmxhdCwgbG5nOiBsb2NhdGlvbi5sbmcgfTtcblx0XHR0aGlzLm1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0bWFwOiBtYXAubWFwLFxuXHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoIGxvY2F0aW9uLmxhdCwgbG9jYXRpb24ubG5nICksXG5cdFx0XHRsYWJlbDogbG9jYXRpb24ubWFya2VyX2xhYmVsLFxuXHRcdH0pO1xuXHRcdHRoaXMuaW5mb1dpbmRvdyA9IHRoaXMuYWRkSW5mb1dpbmRvdyggbG9jYXRpb24uaW5mb193aW5kb3cgKTtcblx0XHR0aGlzLmRlYWN0aXZhdGUoKTtcblx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggdGhpcy5tYXJrZXIsICdjbGljaycsIHRoaXMub25DbGljay5iaW5kKCB0aGlzICkgKTtcblx0fVxuXHRcblx0Ly8gR2VuZXJhdGVzIGFuICdpbmZvIHdpbmRvdycgdGhhdCBvcGVucyB3aGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIG1hcmtlclxuXHRhZGRJbmZvV2luZG93KCBjb250ZW50ICkge1xuXHRcdGlmKCAhY29udGVudCApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuXHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoIHRoaXMucG9zaXRpb24ubGF0LCB0aGlzLnBvc2l0aW9uLmxuZyApLFxuXHRcdFx0Y29udGVudDogY29udGVudCxcblx0XHRcdHBpeGVsT2Zmc2V0OiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggMCwgLTMwICksXG5cdFx0fSk7XG5cdH1cblx0XG5cdC8vIEFjdGl2YXRlcyB0aGUgbWFya2VyXG5cdGFjdGl2YXRlKCkge1xuXHRcdGlmKCB0aGlzLmxvY2F0aW9uLmltYWdlcy5tYXJrZXJfYWN0aXZlICkge1xuXHRcdFx0dGhpcy5yZXBsYWNlSWNvbiggdGhpcy5sb2NhdGlvbi5pbWFnZXMubWFya2VyX2FjdGl2ZSApO1xuXHRcdH1cblx0XHRpZiggdGhpcy5pbmZvV2luZG93ICkge1xuXHRcdFx0dGhpcy5pbmZvV2luZG93Lm9wZW4oIHRoaXMubWFwLm1hcCApO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRGVhY3RpdmF0ZXMgdGhlIG1hcmtlclxuXHRkZWFjdGl2YXRlKCkge1xuXHRcdGlmKCB0aGlzLmxvY2F0aW9uLmltYWdlcy5tYXJrZXIgKSB7XG5cdFx0XHR0aGlzLnJlcGxhY2VJY29uKCB0aGlzLmxvY2F0aW9uLmltYWdlcy5tYXJrZXIgKTtcblx0XHR9XG5cdFx0aWYoIHRoaXMuaW5mb1dpbmRvdyApIHtcblx0XHRcdHRoaXMuaW5mb1dpbmRvdy5jbG9zZSgpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gQ3JlYXRlIGFuZCBhc3NpZ24gYSBuZXcgbWFya2VyIGljb24gZnJvbSB0aGUgcHJvdmlkZWQgaW1hZ2UgZGF0YVxuXHRyZXBsYWNlSWNvbiggaW1hZ2VEYXRhICkge1xuXHRcdGxldCBpY29uRGF0YSA9IHtcblx0XHRcdHVybDogaW1hZ2VEYXRhLnVybCxcblx0XHRcdHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKCBpbWFnZURhdGEuc2l6ZVswXSwgaW1hZ2VEYXRhLnNpemVbMV0gKSxcblx0XHRcdHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKCBpbWFnZURhdGEuc2NhbGVkU2l6ZVswXSwgaW1hZ2VEYXRhLnNjYWxlZFNpemVbMV0gKSxcblx0XHRcdG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KCBpbWFnZURhdGEub3JpZ2luWzBdLCBpbWFnZURhdGEub3JpZ2luWzFdICksXG5cdFx0XHRhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCggaW1hZ2VEYXRhLmFuY2hvclswXSwgaW1hZ2VEYXRhLmFuY2hvclsxXSApLFxuXHRcdFx0bGFiZWxPcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCggaW1hZ2VEYXRhLmxhYmVsT3JpZ2luWzBdLCBpbWFnZURhdGEubGFiZWxPcmlnaW5bMV0gKSxcblx0XHR9O1xuXHRcdHRoaXMubWFya2VyLnNldEljb24oIGljb25EYXRhICk7XG5cdFx0aWYoIHRoaXMuaW5mb1dpbmRvdyApIHtcblx0XHRcdHRoaXMuaW5mb1dpbmRvdy5zZXRPcHRpb25zKHtcblx0XHRcdFx0cGl4ZWxPZmZzZXQ6IG5ldyBnb29nbGUubWFwcy5TaXplKCAwLCAoIGljb25EYXRhLnNjYWxlZFNpemUuaGVpZ2h0ICogLTEgKSApLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBEZWxldGUgc2VsZlxuXHRkZWxldGUoKSB7XG5cdFx0dGhpcy5kZWFjdGl2YXRlKCk7XG5cdFx0dGhpcy5tYXJrZXIuc2V0TWFwKCBudWxsICk7XG5cdH1cblx0XG5cdC8vIFRyaWdnZXIgYWN0aW9ucyB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgbWFya2VyXG5cdG9uQ2xpY2soKSB7XG5cdFx0dGhpcy5tYXAubWFya2Vycy5mb3JFYWNoKCBtYXJrZXIgPT4gbWFya2VyLmRlYWN0aXZhdGUoKSApO1xuXHRcdHRoaXMuYWN0aXZhdGUoKTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC1tYXJrZXIuanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNHZW9sb2NhdGlvbiB7XG5cdFxuXHQvLyBSZXR1cm4gYSBwcmV2aW91c2x5IHNhdmVkIHVzZXIgbG9jYXRpb25cblx0c3RhdGljIGdldCBjYWNoZWRMb2NhdGlvbigpIHtcblx0XHRpZiggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMYXQnICkgPT09IG51bGwgfHwgc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMbmcnICkgPT09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxhdDogcGFyc2VGbG9hdCggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMYXQnICkgKSxcblx0XHRcdGxuZzogcGFyc2VGbG9hdCggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMbmcnICkgKSxcblx0XHR9O1xuXHR9XG5cdFxuXHQvLyBEZXRlY3QgdGhlIHVzZXIncyBjdXJyZW50IGxvY2F0aW9uIGFuZCBjYWNoZSBpdFxuXHRzdGF0aWMgcmVxdWVzdExvY2F0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcblx0XHRcdFx0bG9jYXRpb24gPT4ge1xuXHRcdFx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oICd1c2VyTGF0JywgbG9jYXRpb24uY29vcmRzLmxhdGl0dWRlICk7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggJ3VzZXJMbmcnLCBsb2NhdGlvbi5jb29yZHMubG9uZ2l0dWRlICk7XG5cdFx0XHRcdFx0cmVzb2x2ZSggdGhpcy5jYWNoZWRMb2NhdGlvbiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KCBFcnJvciggZXJyb3IubWVzc2FnZSApICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlbmFibGVIaWdoQWNjdXJhY3k6IGZhbHNlLFxuXHRcdFx0XHRcdHRpbWVvdXQ6IDEwMDAwLFxuXHRcdFx0XHRcdG1heGltdW1BZ2U6IDAsXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSk7XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1nZW9sb2NhdGlvbi5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc0dlb2NvZGVyIHtcblx0XG5cdC8vIEdldCBnZW9jb2RlciBvYmplY3QgKGluaXRpYWxpemUgb25seSBvbmNlKVxuXHRzdGF0aWMgZ2V0IGdlb2NvZGVyKCkge1xuXHRcdGRlbGV0ZSB0aGlzLmdlb2NvZGVyO1xuXHRcdHJldHVybiB0aGlzLmdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG5cdH1cblx0XG5cdC8vIHJldmVyc2UgZ2VvY29kaW5nXG5cdHN0YXRpYyByZXZlcnNlUXVlcnkoIGxhdCwgbG5nICkge1xuXHRcdC8vIGxldCBxdWVyeSA9IHt9XG5cdFx0Ly8gcXVlcnkubG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCBsYXQsIGxuZyApO1xuXHRcdC8vIHF1ZXJ5LnBsYWNlSWQgPSBzdHJpbmc7XG5cdH1cblx0XG5cdC8vIFN1Ym1pdCBnZW9jb2RpbmcgcXVlcnlcblx0c3RhdGljIHF1ZXJ5KCBhZGRyZXNzICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XG5cdFx0XHQvLyBQcmVwYXJlIHF1ZXJ5XG5cdFx0XHRsZXQgcXVlcnkgPSB7fTtcblx0XHRcdHF1ZXJ5LmFkZHJlc3MgPSBhZGRyZXNzLnRyaW0oKTtcblx0XHRcdC8vIHF1ZXJ5LmJvdW5kc1xuXHRcdFx0cXVlcnkuY29tcG9uZW50UmVzdHJpY3Rpb25zID0ge1xuXHRcdFx0XHQvLyByb3V0ZVxuXHRcdFx0XHQvLyBsb2NhbGl0eVxuXHRcdFx0XHQvLyBhZG1pbmlzdHJhdGl2ZUFyZWFcblx0XHRcdFx0Ly8gcG9zdGFsQ29kZVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0Ly8gQXBwbHkgJ2ZvY3VzIGNvdW50cnknIGZyb20gdXNlciBzZXR0aW5nc1xuXHRcdFx0aWYoIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5ICYmICFsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfc3RyaWN0ICkge1xuXHRcdFx0XHRxdWVyeS5yZWdpb24gPSBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeTtcblx0XHRcdH1cblx0XHRcdGlmKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeSAmJiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfc3RyaWN0ICkge1xuXHRcdFx0XHRxdWVyeS5jb21wb25lbnRSZXN0cmljdGlvbnMuY291bnRyeSA9IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBWYWxpZGF0ZSBxdWVyeVxuXHRcdFx0aWYoICFxdWVyeS5hZGRyZXNzICkge1xuXHRcdFx0XHRyZWplY3QoIEVycm9yKCBsb2NzZWFyY2guYWxlcnRzLmVtcHR5X2FkZHJlc3MgKSApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBTZW5kIGdlb2NvZGUgcmVxdWVzdFxuXHRcdFx0dGhpcy5nZW9jb2Rlci5nZW9jb2RlKCBxdWVyeSwgKHJlc3VsdHMsIHN0YXR1cykgPT4ge1xuXHRcdFx0XHRpZiggc3RhdHVzICE9ICdPSycgKSB7XG5cdFx0XHRcdFx0cmVqZWN0KCBFcnJvciggdGhpcy50cmFuc2xhdGVFcnJvciggc3RhdHVzICkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc29sdmUoIHJlc3VsdHMgKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cblx0XG5cdC8vIENoZWNrIGZvciBlcnJvcnMgaW4gcmVjZWl2ZWQgZGF0YVxuXHRzdGF0aWMgdHJhbnNsYXRlRXJyb3IoIHN0YXR1cyApIHtcblx0XHRpZiggc3RhdHVzID09ICdJTlZBTElEX1JFUVVFU1QnICkge1xuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMuaW52YWxpZF9yZXF1ZXN0O1xuXHRcdH0gZWxzZSBpZiggc3RhdHVzID09ICdPVkVSX1FVRVJZX0xJTUlUJyApIHtcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLnF1ZXJ5X2xpbWl0O1xuXHRcdH0gZWxzZSBpZiggc3RhdHVzID09ICdaRVJPX1JFU1VMVFMnICkge1xuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMubm9fcmVzdWx0cztcblx0XHR9IGVsc2UgaWYoIHN0YXR1cyAhPSAnT0snICkge1xuXHRcdFx0Ly8gVU5LTk9XTl9FUlJPUiBhbmQgUkVRVUVTVF9ERU5JRURcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLnVua25vd25fZXJyb3I7XG5cdFx0fVxuXHR9XG5cdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9jbGFzcy5sb2NhdGlvbnMtZ2VvY29kZXIuanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNEYXRhYmFzZSB7XG5cdFxuXHQvLyBHZXRzIHVzZWZ1bCBpbmZvIGZyb20gYSBnZW9jb2RlIHJlc3VsdCB0byBiZSB1c2VkIG9uIHRoZSBkYiBxdWVyeVxuXHRzdGF0aWMgZ2V0R2VvY29kZURhdGEoIHJlc3VsdCApIHtcblx0XHRsZXQgZGJfZmllbGRzID0ge1xuXHRcdFx0J2NvdW50cnknOiAnY291bnRyeScsXG5cdFx0XHQnYWRtaW5pc3RyYXRpdmVfYXJlYV9sZXZlbF8xJzogJ3N0YXRlJyxcblx0XHRcdCdwb3N0YWxfY29kZSc6ICdwb3N0Y29kZScsXG5cdFx0XHQnbG9jYWxpdHknOiAnY2l0eScsXG5cdFx0fTtcblx0XHRsZXQgcmVzdWx0X3R5cGUgPSByZXN1bHQudHlwZXMuZmluZCggdHlwZSA9PiBkYl9maWVsZHNbdHlwZV0gKTtcblx0XHRpZiggcmVzdWx0X3R5cGUgKSB7XG5cdFx0XHRsZXQgcmVzdWx0X2RhdGEgPSByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoIGNvbXBvbmVudCA9PiBjb21wb25lbnQudHlwZXMuaW5jbHVkZXMoIHJlc3VsdF90eXBlICkgKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvZGU6IHJlc3VsdF9kYXRhLnNob3J0X25hbWUsXG5cdFx0XHRcdG5hbWU6IHJlc3VsdF9kYXRhLmxvbmdfbmFtZSxcblx0XHRcdFx0ZmllbGQ6IGRiX2ZpZWxkc1tyZXN1bHRfdHlwZV0sXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdFxuXHQvLyBTdWJtaXQgYSBkYXRhYmFzZSBxdWVyeVxuXHRzdGF0aWMgcXVlcnkoIGxhdCwgbG5nLCByYWRpdXMgKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcblx0XHRcdC8vIFByZXBhcmUgcXVlcnlcblx0XHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdFx0J2FjdGlvbic6ICdsb2NhdGlvbnNfbWFwX3NlYXJjaCcsXG5cdFx0XHRcdGxhdCxcblx0XHRcdFx0bG5nLFxuXHRcdFx0XHRzZWFyY2hfcmFkaXVzOiByYWRpdXMsXG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRpZiggdHlwZW9mIGZldGNoID09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdC8vIElmIGZldGNoIGlzIGF2YWlsYWJsZSwgdXNlIGl0XG5cdFx0XHRcdGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuXHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0Zm9yKCBsZXQga2V5IGluIHF1ZXJ5ICkge1xuXHRcdFx0XHRcdGlmKCBxdWVyeS5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoIGtleSwgcXVlcnlba2V5XSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmZXRjaCggbG9jc2VhcmNoLmFqYXhfdXJsLCB7bWV0aG9kOiAnUE9TVCcsIGhlYWRlcnMsIGJvZHk6IGZvcm1EYXRhfSApXG5cdFx0XHRcdFx0LnRoZW4oIHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0XHRpZiggIXJlc3VsdC5vayApIHJlamVjdCggRXJyb3IoIHJlc3VsdC5zdGF0dXNUZXh0ICkgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQuanNvbigpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oIHJlc29sdmUgKS5jYXRjaCggcmVqZWN0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBPdGhlcndpc2UgZmFsbGJhY2sgdG8galF1ZXJ5XG5cdFx0XHRcdGpRdWVyeS5wb3N0KHtcblx0XHRcdFx0XHR1cmw6ICAgICAgbG9jc2VhcmNoLmFqYXhfdXJsLFxuXHRcdFx0XHRcdGRhdGE6ICAgICBxdWVyeSxcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbigganFYSFIsIHN0YXR1cywgZXJyb3IgKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoIEVycm9yKCBgRXJyb3I6ICR7ZXJyb3J9YCApICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggbG9jYXRpb25zLCBzdGF0dXMsIGpxWEhSICkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSggbG9jYXRpb25zICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZWRpdC1zZXR0aW5ncy5zY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZnJvbnRlbmQuc2Nzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9