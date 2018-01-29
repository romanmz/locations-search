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
		if ($(this).closest('.locsearch_box').length > 0) {
			return;
		}
		var map = new __WEBPACK_IMPORTED_MODULE_0__class_locations_map_js__["a" /* default */](this);
		map.addMarkersFromLocations($(this).data('locations'));
	});

	// Initialize search boxes
	$('.locsearch_box').each(function () {

		// Init objects
		// ------------------------------
		var box = $(this);
		var form = box.find('.locsearch_form');
		var messagesBox = box.find('.locsearch_messages');
		var resultsBox = box.find('.locsearch_results');
		var mapBox = box.find('.locsearch_map');
		var addressField = form.find('input[name=address]');
		var map = new __WEBPACK_IMPORTED_MODULE_0__class_locations_map_js__["a" /* default */](mapBox[0]);

		// Init functions
		// ------------------------------

		// Lock/unlock search box
		function lockSearch() {
			box.data('isLocked', true);
			box.addClass('loading');
			box.find(':input').prop('disabled', true);
		}
		function unlockSearch() {
			box.data('isLocked', false);
			box.removeClass('loading');
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
					resultsBox.children('.locsearch_result').removeClass('selected');
					listItem.addClass('selected');
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
			if (this.location.marker_images && this.location.marker_images.active) {
				this.replaceIcon(this.location.marker_images.active);
			}
			if (this.infoWindow) {
				this.infoWindow.open(this.map.map);
			}
		}

		// Deactivates the marker

	}, {
		key: 'deactivate',
		value: function deactivate() {
			if (this.location.marker_images && this.location.marker_images.default) {
				this.replaceIcon(this.location.marker_images.default);
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
					'action': 'locations_search',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWZhZjc5Yzc5NmQ2NjRiZWU1ZjQiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9qcy9zaG9ydGNvZGVzLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzP2VjNjciLCJ3ZWJwYWNrOi8vLy4vX3NyYy9zY3NzL2VkaXQtc2V0dGluZ3Muc2Nzcz82NTU0Iiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzU0ODAiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJnb29nbGUiLCJhbGVydCIsImxvY3NlYXJjaCIsImFsZXJ0cyIsImFwaV91bmF2YWlsYWJsZSIsImVhY2giLCJjbG9zZXN0IiwibGVuZ3RoIiwibWFwIiwiYWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMiLCJkYXRhIiwiYm94IiwiZm9ybSIsImZpbmQiLCJtZXNzYWdlc0JveCIsInJlc3VsdHNCb3giLCJtYXBCb3giLCJhZGRyZXNzRmllbGQiLCJsb2NrU2VhcmNoIiwiYWRkQ2xhc3MiLCJwcm9wIiwidW5sb2NrU2VhcmNoIiwicmVtb3ZlQ2xhc3MiLCJ1c2VyTG9jYXRpb25EZXRlY3RlZCIsImxhdExuZyIsImRhdGFiYXNlUmVxdWVzdCIsImxhdCIsImxuZyIsIm1hcF9hdHRyaWJ1dGVzIiwic2VhcmNoX3JhZGl1cyIsInRleHQiLCJ5b3VyX2xvY2F0aW9uIiwicmVxdWVzdFVzZXJMb2NhdGlvbiIsInZhbCIsInRyaW0iLCJMb2NhdGlvbnNHZW9sb2NhdGlvbiIsInJlcXVlc3RMb2NhdGlvbiIsInRoZW4iLCJjYXRjaCIsImdlb2NvZGVSZXF1ZXN0IiwiYWRkcmVzcyIsIkxvY2F0aW9uc0dlb2NvZGVyIiwicXVlcnkiLCJmaW5hbGx5IiwiZ2VvY29kZVJlc3BvbnNlIiwiZSIsIm1lc3NhZ2UiLCJyZXN1bHRzIiwic2VhcmNoRGF0YWJhc2VGcm9tR2VvY29kZSIsInNob3dHZW9jb2RlQWx0ZXJuYXRpdmVzIiwicmVzdWx0IiwiZ2VvbWV0cnkiLCJsb2NhdGlvbiIsImZvcm1hdHRlZF9hZGRyZXNzIiwiaHRtbCIsImRpZF95b3VfbWVhbiIsImxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsImxpbmsiLCJocmVmIiwib24iLCJwcmV2ZW50RGVmYXVsdCIsImFwcGVuZCIsInJhZGl1cyIsInJlZmVyZW5jZVRleHQiLCJuZXdSYWRpdXMiLCJzZWFyY2hpbmdfbmVhciIsIm1hcFJhZGl1cyIsImRyYXdSYWRpdXMiLCJvblJhZGl1c0NoYW5nZSIsImdldENlbnRlciIsImdldFJhZGl1cyIsIm1hcHMiLCJldmVudCIsImFkZExpc3RlbmVyIiwiTG9jYXRpb25zRGF0YWJhc2UiLCJkYXRhYmFzZVJlc3BvbnNlIiwibG9jYXRpb25zIiwibWFueV9yZXN1bHRzIiwicmVwbGFjZSIsImVtcHR5IiwibGlzdF9pdGVtIiwibGlzdEl0ZW0iLCJtYXJrZXIiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwicG9zaXRpb24iLCJ0b3AiLCJjaGlsZHJlbiIsInRhcmdldCIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJ0cmlnZ2VyIiwiY2FjaGVkTG9jYXRpb24iLCJMb2NhdGlvbnNNYXAiLCJjb250YWluZXIiLCJNYXAiLCJzdHlsZXMiLCJtYXJrZXJzIiwiTWFya2VyQ2x1c3RlcmVyIiwiY2x1c3RlcnNfaW1hZ2UiLCJtYXJrZXJDbHVzdGVyZXIiLCJyZXNldE1hcExvY2F0aW9uIiwic2V0Q2VudGVyIiwiaW5pdGlhbF9sYXQiLCJpbml0aWFsX2xuZyIsInNldFpvb20iLCJtYXhfem9vbSIsIm5ld0JvdW5kcyIsInNlYXJjaFJhZGl1cyIsImdldEJvdW5kcyIsIkxhdExuZ0JvdW5kcyIsImV4dGVuZCIsIm0iLCJnZXRQb3NpdGlvbiIsImZpdEJvdW5kcyIsImdldFpvb20iLCJyZW1vdmVBbGxNYXJrZXJzIiwiYWRkTWFya2VyRnJvbUxvY2F0aW9uIiwiYmluZCIsImNoZWNrWm9vbUxldmVsIiwibmV3TWFya2VyIiwiYWRkTWFya2VyIiwiZGVsZXRlIiwiY2xlYXJNYXJrZXJzIiwic2V0TWFwIiwiQ2lyY2xlIiwic3Ryb2tlV2VpZ2h0Iiwic3Ryb2tlQ29sb3IiLCJmaWxsT3BhY2l0eSIsImNlbnRlciIsImVkaXRhYmxlIiwicmFkaXVzUmVzaXplZCIsInJhZGl1c01vdmVkIiwibWF4X3JhZGl1cyIsInNldFJhZGl1cyIsIkxvY2F0aW9uc01hcE1hcmtlciIsIk1hcmtlciIsIkxhdExuZyIsImxhYmVsIiwibWFya2VyX2xhYmVsIiwiaW5mb1dpbmRvdyIsImFkZEluZm9XaW5kb3ciLCJpbmZvX3dpbmRvdyIsImRlYWN0aXZhdGUiLCJvbkNsaWNrIiwiY29udGVudCIsIkluZm9XaW5kb3ciLCJwaXhlbE9mZnNldCIsIlNpemUiLCJtYXJrZXJfaW1hZ2VzIiwiYWN0aXZlIiwicmVwbGFjZUljb24iLCJvcGVuIiwiZGVmYXVsdCIsImNsb3NlIiwiaW1hZ2VEYXRhIiwiaWNvbkRhdGEiLCJ1cmwiLCJzaXplIiwic2NhbGVkU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibGFiZWxPcmlnaW4iLCJzZXRJY29uIiwic2V0T3B0aW9ucyIsImhlaWdodCIsImFjdGl2YXRlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInNlc3Npb25TdG9yYWdlIiwic2V0SXRlbSIsImNvb3JkcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiRXJyb3IiLCJlcnJvciIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiZ2V0SXRlbSIsInBhcnNlRmxvYXQiLCJjb21wb25lbnRSZXN0cmljdGlvbnMiLCJmb2N1c19jb3VudHJ5IiwiZm9jdXNfc3RyaWN0IiwicmVnaW9uIiwiY291bnRyeSIsImVtcHR5X2FkZHJlc3MiLCJnZW9jb2RlciIsImdlb2NvZGUiLCJzdGF0dXMiLCJ0cmFuc2xhdGVFcnJvciIsImludmFsaWRfcmVxdWVzdCIsInF1ZXJ5X2xpbWl0Iiwibm9fcmVzdWx0cyIsInVua25vd25fZXJyb3IiLCJHZW9jb2RlciIsImRiX2ZpZWxkcyIsInJlc3VsdF90eXBlIiwidHlwZXMiLCJ0eXBlIiwicmVzdWx0X2RhdGEiLCJhZGRyZXNzX2NvbXBvbmVudHMiLCJjb21wb25lbnQiLCJpbmNsdWRlcyIsImNvZGUiLCJzaG9ydF9uYW1lIiwibmFtZSIsImxvbmdfbmFtZSIsImZpZWxkIiwiZmV0Y2giLCJoZWFkZXJzIiwiSGVhZGVycyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImFqYXhfdXJsIiwibWV0aG9kIiwiYm9keSIsIm9rIiwic3RhdHVzVGV4dCIsImpzb24iLCJwb3N0IiwiZGF0YVR5cGUiLCJqcVhIUiIsInN1Y2Nlc3MiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FB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TUFKRixFQUtFL0wsSUFMRixDQUtRc0ksT0FMUixFQUtrQnJJLEtBTGxCLENBS3lCc0ksTUFMekI7QUFNQSxLQWZELE1BZU87QUFDTjtBQUNBaEwsWUFBT3lPLElBQVAsQ0FBWTtBQUNYdEUsV0FBVTdKLFVBQVU2TixRQURUO0FBRVhyTixZQUFVZ0MsS0FGQztBQUdYNEwsZ0JBQVUsTUFIQztBQUlYaEQsYUFBTyxlQUFVaUQsS0FBVixFQUFpQm5DLE1BQWpCLEVBQXlCZCxNQUF6QixFQUFpQztBQUN2Q1YsY0FBUVMsa0JBQWlCQyxNQUFqQixDQUFSO0FBQ0EsT0FOVTtBQU9Ya0QsZUFBUyxpQkFBVTFKLFNBQVYsRUFBcUJzSCxNQUFyQixFQUE2Qm1DLEtBQTdCLEVBQXFDO0FBQzdDNUQsZUFBUzdGLFNBQVQ7QUFDQTtBQVRVLE1BQVo7QUFXQTtBQUVELElBeENNLENBQVA7QUF5Q0E7Ozs7Ozt5REFqRW1CRixpQjs7Ozs7O0FDQXJCLHlDOzs7Ozs7QUNBQSx5Qzs7Ozs7O0FDQUEseUMiLCJmaWxlIjoiL2Fzc2V0cy9qcy9zaG9ydGNvZGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWZhZjc5Yzc5NmQ2NjRiZWU1ZjQiLCJpbXBvcnQgTG9jYXRpb25zTWFwIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLW1hcC5qcyc7XG5pbXBvcnQgTG9jYXRpb25zR2VvbG9jYXRpb24gZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtZ2VvbG9jYXRpb24uanMnO1xuaW1wb3J0IExvY2F0aW9uc0dlb2NvZGVyIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzJztcbmltcG9ydCBMb2NhdGlvbnNEYXRhYmFzZSBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1kYXRhYmFzZS5qcyc7XG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCQpe1xuXHRcblx0Ly8gQ2hlY2sgR29vZ2xlIE1hcHMgQVBJXG5cdGlmKCB0eXBlb2YgZ29vZ2xlICE9PSAnb2JqZWN0JyApIHtcblx0XHRhbGVydCggbG9jc2VhcmNoLmFsZXJ0cy5hcGlfdW5hdmFpbGFibGUgKTtcblx0XHRyZXR1cm47XG5cdH1cblx0XG5cdC8vIEdlbmVyYXRlIGxvY2F0aW9ucyBtYXBzXG5cdCQoJy5sb2NzZWFyY2hfbWFwJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdGlmKCAkKHRoaXMpLmNsb3Nlc3QoJy5sb2NzZWFyY2hfYm94JykubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0bGV0IG1hcCA9IG5ldyBMb2NhdGlvbnNNYXAoIHRoaXMgKTtcblx0XHRtYXAuYWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMoICQodGhpcykuZGF0YSgnbG9jYXRpb25zJykgKTtcblx0fSk7XG5cdFxuXHQvLyBJbml0aWFsaXplIHNlYXJjaCBib3hlc1xuXHQkKCcubG9jc2VhcmNoX2JveCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcblx0XHRcblx0XHQvLyBJbml0IG9iamVjdHNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRsZXQgYm94ID0gJCh0aGlzKTtcblx0XHRsZXQgZm9ybSA9IGJveC5maW5kKCcubG9jc2VhcmNoX2Zvcm0nKTtcblx0XHRsZXQgbWVzc2FnZXNCb3ggPSBib3guZmluZCgnLmxvY3NlYXJjaF9tZXNzYWdlcycpO1xuXHRcdGxldCByZXN1bHRzQm94ID0gYm94LmZpbmQoJy5sb2NzZWFyY2hfcmVzdWx0cycpO1xuXHRcdGxldCBtYXBCb3ggPSBib3guZmluZCgnLmxvY3NlYXJjaF9tYXAnKTtcblx0XHRsZXQgYWRkcmVzc0ZpZWxkID0gZm9ybS5maW5kKCAnaW5wdXRbbmFtZT1hZGRyZXNzXScgKTtcblx0XHRsZXQgbWFwID0gbmV3IExvY2F0aW9uc01hcCggbWFwQm94WzBdICk7XG5cdFx0XG5cdFx0XG5cdFx0Ly8gSW5pdCBmdW5jdGlvbnNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcblx0XHQvLyBMb2NrL3VubG9jayBzZWFyY2ggYm94XG5cdFx0ZnVuY3Rpb24gbG9ja1NlYXJjaCgpIHtcblx0XHRcdGJveC5kYXRhKCAnaXNMb2NrZWQnLCB0cnVlICk7XG5cdFx0XHRib3guYWRkQ2xhc3MoICdsb2FkaW5nJyApO1xuXHRcdFx0Ym94LmZpbmQoICc6aW5wdXQnICkucHJvcCggJ2Rpc2FibGVkJywgdHJ1ZSApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1bmxvY2tTZWFyY2goKSB7XG5cdFx0XHRib3guZGF0YSggJ2lzTG9ja2VkJywgZmFsc2UgKTtcblx0XHRcdGJveC5yZW1vdmVDbGFzcyggJ2xvYWRpbmcnICk7XG5cdFx0XHRib3guZmluZCggJzppbnB1dCcgKS5wcm9wKCAnZGlzYWJsZWQnLCBmYWxzZSApO1xuXHRcdH1cblx0XHRcblx0XHQvLyBTZWFyY2ggZGF0YWJhc2UgYmFzZWQgb24gdGhlIHVzZXIncyBjdXJyZW50IGxvY2F0aW9uXG5cdFx0ZnVuY3Rpb24gdXNlckxvY2F0aW9uRGV0ZWN0ZWQoIGxhdExuZyApIHtcblx0XHRcdGRhdGFiYXNlUmVxdWVzdCggbGF0TG5nLmxhdCwgbGF0TG5nLmxuZywgbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLnNlYXJjaF9yYWRpdXMsIGxvY3NlYXJjaC50ZXh0LnlvdXJfbG9jYXRpb24gKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcmVxdWVzdFVzZXJMb2NhdGlvbigpIHtcblx0XHRcdGlmKCBhZGRyZXNzRmllbGQudmFsKCkudHJpbSgpID09ICcnICkge1xuXHRcdFx0XHRMb2NhdGlvbnNHZW9sb2NhdGlvbi5yZXF1ZXN0TG9jYXRpb24oKVxuXHRcdFx0XHRcdC50aGVuKCB1c2VyTG9jYXRpb25EZXRlY3RlZCApXG5cdFx0XHRcdFx0LmNhdGNoKCBlPT57fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvLyBVc2UgZ2VvY29kaW5nIHRvIGNvbnZlcnQgYWRkcmVzc2VzIGludG8gY29vcmRpbmF0ZXNcblx0XHRmdW5jdGlvbiBnZW9jb2RlUmVxdWVzdCggYWRkcmVzcyApIHtcblx0XHRcdGlmKCBib3guZGF0YSggJ2lzTG9ja2VkJyApICkgcmV0dXJuO1xuXHRcdFx0bG9ja1NlYXJjaCgpO1xuXHRcdFx0TG9jYXRpb25zR2VvY29kZXIucXVlcnkoIGFkZHJlc3MgKVxuXHRcdFx0XHQuZmluYWxseSggdW5sb2NrU2VhcmNoIClcblx0XHRcdFx0LnRoZW4oIGdlb2NvZGVSZXNwb25zZSApXG5cdFx0XHRcdC5jYXRjaCggZSA9PiBhbGVydCggYEVycm9yOiAke2UubWVzc2FnZX1gICkgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2VvY29kZVJlc3BvbnNlKCByZXN1bHRzICkge1xuXHRcdFx0aWYoIHJlc3VsdHMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlKCByZXN1bHRzWzBdICk7XG5cdFx0XHR9IGVsc2UgaWYoIHJlc3VsdHMubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0c2hvd0dlb2NvZGVBbHRlcm5hdGl2ZXMoIHJlc3VsdHMgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VhcmNoRGF0YWJhc2VGcm9tR2VvY29kZSggcmVzdWx0ICkge1xuXHRcdFx0ZGF0YWJhc2VSZXF1ZXN0KCByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubGF0KCksIHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sbmcoKSwgbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLnNlYXJjaF9yYWRpdXMsIHJlc3VsdC5mb3JtYXR0ZWRfYWRkcmVzcyApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93R2VvY29kZUFsdGVybmF0aXZlcyggcmVzdWx0cyApIHtcblx0XHRcdG1lc3NhZ2VzQm94Lmh0bWwoICc8cD4nK2xvY3NlYXJjaC50ZXh0LmRpZF95b3VfbWVhbisnPC9wPicgKTtcblx0XHRcdGxldCBsaXN0ID0gJCgnPHVsPicpO1xuXHRcdFx0cmVzdWx0cy5mb3JFYWNoKCByZXN1bHQgPT4ge1xuXHRcdFx0XHRsZXQgaXRlbSA9ICQoJzxsaT4nKTtcblx0XHRcdFx0bGV0IGxpbmsgPSAkKCc8YT4nLHsgaHJlZjogJyMnLCB0ZXh0OiByZXN1bHQuZm9ybWF0dGVkX2FkZHJlc3MgfSk7XG5cdFx0XHRcdGxpbmsub24oICdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHNlYXJjaERhdGFiYXNlRnJvbUdlb2NvZGUoIHJlc3VsdCApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0bGlzdC5hcHBlbmQoIGl0ZW0uYXBwZW5kKCBsaW5rICkgKTtcblx0XHRcdH0pO1xuXHRcdFx0bWVzc2FnZXNCb3guYXBwZW5kKCBsaXN0ICk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIERhdGFiYXNlIHJlc3VsdHNcblx0XHRmdW5jdGlvbiBkYXRhYmFzZVJlcXVlc3QoIGxhdCwgbG5nLCByYWRpdXMsIHJlZmVyZW5jZVRleHQsIG5ld1JhZGl1cz10cnVlICkge1xuXHRcdFx0aWYoIGJveC5kYXRhKCAnaXNMb2NrZWQnICkgKSByZXR1cm47XG5cdFx0XHRsb2NrU2VhcmNoKCk7XG5cdFx0XHRtZXNzYWdlc0JveC5odG1sKCByZWZlcmVuY2VUZXh0ID8gYDxwPiR7bG9jc2VhcmNoLnRleHQuc2VhcmNoaW5nX25lYXJ9ICR7cmVmZXJlbmNlVGV4dH08L3A+YCA6ICcnICk7XG5cdFx0XHRcblx0XHRcdC8vIERyYXcgYSBuZXcgcmFkaXVzIGFyZWEsIGFuZCByZS1zdWJtaXQgZGF0YWJhc2UgcXVlcnkgaWYgdGhlIHVzZXIgcmVzaXplcyBvciBtb3ZlcyB0aGUgcmFkaXVzXG5cdFx0XHRpZiggbmV3UmFkaXVzICkge1xuXHRcdFx0XHRsZXQgbWFwUmFkaXVzID0gbWFwLmRyYXdSYWRpdXMoIGxhdCwgbG5nLCByYWRpdXMgKTtcblx0XHRcdFx0bGV0IG9uUmFkaXVzQ2hhbmdlID0gKCk9Pntcblx0XHRcdFx0XHRkYXRhYmFzZVJlcXVlc3QoIG1hcFJhZGl1cy5nZXRDZW50ZXIoKS5sYXQoKSwgbWFwUmFkaXVzLmdldENlbnRlcigpLmxuZygpLCBtYXBSYWRpdXMuZ2V0UmFkaXVzKCkvMTAwMCwgJycsIGZhbHNlICk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCBtYXBSYWRpdXMsICdyYWRpdXNfY2hhbmdlZCcsIG9uUmFkaXVzQ2hhbmdlICk7XG5cdFx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCBtYXBSYWRpdXMsICdjZW50ZXJfY2hhbmdlZCcsIG9uUmFkaXVzQ2hhbmdlICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFN1Ym1pdCBkYXRhYmFzZSBxdWVyeVxuXHRcdFx0TG9jYXRpb25zRGF0YWJhc2UucXVlcnkoIGxhdCwgbG5nLCByYWRpdXMgKVxuXHRcdFx0XHQuZmluYWxseSggdW5sb2NrU2VhcmNoIClcblx0XHRcdFx0LnRoZW4oIGRhdGFiYXNlUmVzcG9uc2UgKVxuXHRcdFx0XHQuY2F0Y2goIGUgPT4gYWxlcnQoIGBFcnJvcjogJHtlLm1lc3NhZ2V9YCApICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRhdGFiYXNlUmVzcG9uc2UoIGxvY2F0aW9ucyApIHtcblx0XHRcdGlmKCAhbG9jYXRpb25zLmxlbmd0aCApIHtcblx0XHRcdFx0bWVzc2FnZXNCb3guYXBwZW5kKCAnPHA+Jytsb2NzZWFyY2gudGV4dFsnMF9yZXN1bHRzJ10rJzwvcD4nICk7XG5cdFx0XHR9IGVsc2UgaWYoIGxvY2F0aW9ucy5sZW5ndGggPT0gMSApIHtcblx0XHRcdFx0bWVzc2FnZXNCb3guYXBwZW5kKCAnPHA+Jytsb2NzZWFyY2gudGV4dFsnMV9yZXN1bHQnXSsnPC9wPicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lc3NhZ2VzQm94LmFwcGVuZCggJzxwPicrbG9jc2VhcmNoLnRleHQubWFueV9yZXN1bHRzLnJlcGxhY2UoICclcycsIGxvY2F0aW9ucy5sZW5ndGggKSArJzwvcD4nICk7XG5cdFx0XHR9XG5cdFx0XHRtYXAuYWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMoIGxvY2F0aW9ucyApO1xuXHRcdFx0XG5cdFx0XHQvLyBVcGRhdGUgcmVzdWx0cyBsaXN0XG5cdFx0XHRyZXN1bHRzQm94LmVtcHR5KCk7XG5cdFx0XHRsb2NhdGlvbnMuZm9yRWFjaCggbG9jYXRpb24gPT4ge1xuXHRcdFx0XHRpZiggIWxvY2F0aW9uLmxpc3RfaXRlbSApIHJldHVybjtcblx0XHRcdFx0bGV0IGxpc3RJdGVtID0gJChsb2NhdGlvbi5saXN0X2l0ZW0pO1xuXHRcdFx0XHRyZXN1bHRzQm94LmFwcGVuZCggbGlzdEl0ZW0gKTtcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIGxvY2F0aW9uLm1hcmtlci5tYXJrZXIsICdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHRyZXN1bHRzQm94LmFuaW1hdGUoeyBzY3JvbGxUb3A6IHJlc3VsdHNCb3guc2Nyb2xsVG9wKCkgKyBsaXN0SXRlbS5wb3NpdGlvbigpLnRvcCB9KTtcblx0XHRcdFx0XHRyZXN1bHRzQm94LmNoaWxkcmVuKCAnLmxvY3NlYXJjaF9yZXN1bHQnICkucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRsaXN0SXRlbS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0bGlzdEl0ZW0ub24oICdjbGljaycsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKCBlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09ICdhJyApIHJldHVybjtcblx0XHRcdFx0XHRnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKCBsb2NhdGlvbi5tYXJrZXIubWFya2VyLCAnY2xpY2snICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdC8vIEhhbmRsZSB1c2VyIGFjdGlvbnNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcblx0XHQvLyBGb3JtIHN1Ym1pc3Npb25cblx0XHRmb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRnZW9jb2RlUmVxdWVzdCggYWRkcmVzc0ZpZWxkLnZhbCgpICk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gVHJpZ2dlciBhdXRvbWF0aWMgc2VhcmNoZXNcblx0XHRpZiggZm9ybS5kYXRhKCAnbG9jc2VhcmNoLWF1dG9zZWFyY2gnICkgKSB7XG5cdFx0XHRmb3JtLnRyaWdnZXIoICdzdWJtaXQnICk7XG5cdFx0fSBlbHNlIGlmKCBMb2NhdGlvbnNHZW9sb2NhdGlvbi5jYWNoZWRMb2NhdGlvbiApIHtcblx0XHRcdHVzZXJMb2NhdGlvbkRldGVjdGVkKCBMb2NhdGlvbnNHZW9sb2NhdGlvbi5jYWNoZWRMb2NhdGlvbiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXF1ZXN0VXNlckxvY2F0aW9uKCk7XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHR9KTtcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9zaG9ydGNvZGVzLmpzIiwiaW1wb3J0IExvY2F0aW9uc01hcE1hcmtlciBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc01hcCB7XG5cdFxuXHQvLyBDcmVhdGUgbWFwIGFuZCBzZXQgZGVmYXVsdCBhdHRyaWJ1dGVzXG5cdGNvbnN0cnVjdG9yKCBjb250YWluZXIgKSB7XG5cdFx0dGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cdFx0dGhpcy5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCBjb250YWluZXIsIHtcblx0XHRcdHN0eWxlczogbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLnN0eWxlcyxcblx0XHR9KTtcblx0XHR0aGlzLm1hcmtlcnMgPSBbXTtcblx0XHRpZiggdHlwZW9mIE1hcmtlckNsdXN0ZXJlciA9PT0gJ2Z1bmN0aW9uJyAmJiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuY2x1c3RlcnNfaW1hZ2UgKSB7XG5cdFx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlciA9IG5ldyBNYXJrZXJDbHVzdGVyZXIoIHRoaXMubWFwLCBbXSwgbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmNsdXN0ZXJzX2ltYWdlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyID0gbnVsbDtcblx0XHR9XG5cdFx0dGhpcy5yZXNldE1hcExvY2F0aW9uKCk7XG5cdH1cblx0XG5cdC8vIFNldHMgdGhlIG1hcCB0byB0aGUgZGVmYXVsdCBsb2NhdGlvblxuXHRyZXNldE1hcExvY2F0aW9uKCkge1xuXHRcdHRoaXMubWFwLnNldENlbnRlcih7XG5cdFx0XHRsYXQ6IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5pbml0aWFsX2xhdCxcblx0XHRcdGxuZzogbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmluaXRpYWxfbG5nLFxuXHRcdH0pO1xuXHRcdHRoaXMubWFwLnNldFpvb20oIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfem9vbSApO1xuXHR9XG5cdFxuXHQvLyBFbmZvcmNlIG1heCB6b29tIGxldmVsXG5cdGNoZWNrWm9vbUxldmVsKCkge1xuXHRcdGxldCBuZXdCb3VuZHMgPSB0aGlzLnNlYXJjaFJhZGl1cyA/IHRoaXMuc2VhcmNoUmFkaXVzLmdldEJvdW5kcygpIDogbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xuXHRcdHRoaXMubWFya2Vycy5mb3JFYWNoKCBtID0+IHsgbmV3Qm91bmRzLmV4dGVuZCggbS5tYXJrZXIuZ2V0UG9zaXRpb24oKSApIH0gKTtcblx0XHR0aGlzLm1hcC5maXRCb3VuZHMoIG5ld0JvdW5kcyApO1xuXHRcdGlmKCB0aGlzLm1hcC5nZXRab29tKCkgPiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3pvb20gKSB7XG5cdFx0XHR0aGlzLm1hcC5zZXRab29tKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3pvb20gKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIENyZWF0ZSBhbmQgYWRkIG1hcmtlcnMgZnJvbSBhIGxpc3Qgb2YgbG9jYXRpb25zIChkZWxldGVzIGFsbCBwcmV2aW91cyBtYXJrZXJzKVxuXHRhZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyggbG9jYXRpb25zICkge1xuXHRcdHRoaXMucmVtb3ZlQWxsTWFya2VycygpO1xuXHRcdHRoaXMubWFya2VycyA9IGxvY2F0aW9ucy5tYXAoIHRoaXMuYWRkTWFya2VyRnJvbUxvY2F0aW9uLmJpbmQoIHRoaXMgKSApO1xuXHRcdHRoaXMuY2hlY2tab29tTGV2ZWwoKTtcblx0fVxuXHRhZGRNYXJrZXJGcm9tTG9jYXRpb24oIGxvY2F0aW9uICkge1xuXHRcdGxldCBuZXdNYXJrZXIgPSBuZXcgTG9jYXRpb25zTWFwTWFya2VyKCB0aGlzLCBsb2NhdGlvbiApO1xuXHRcdGlmKCB0aGlzLm1hcmtlckNsdXN0ZXJlciApIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlciggbmV3TWFya2VyLm1hcmtlciApO1xuXHRcdH1cblx0XHRsb2NhdGlvbi5tYXJrZXIgPSBuZXdNYXJrZXI7XG5cdFx0cmV0dXJuIG5ld01hcmtlcjtcblx0fVxuXHRcblx0Ly8gRGVsZXRlIGFsbCBleGlzdGluZyBtYXJrZXJzXG5cdHJlbW92ZUFsbE1hcmtlcnMoKSB7XG5cdFx0dGhpcy5tYXJrZXJzLmZvckVhY2goIG1hcmtlciA9PiBtYXJrZXIuZGVsZXRlKCkgKTtcblx0XHR0aGlzLm1hcmtlcnMgPSBbXTtcblx0XHRpZiggdGhpcy5tYXJrZXJDbHVzdGVyZXIgKSB7XG5cdFx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlci5jbGVhck1hcmtlcnMoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIERyYXcgc2VhcmNoIHJhZGl1cyBvbiB0aGUgbWFwXG5cdGRyYXdSYWRpdXMoIGxhdCwgbG5nLCByYWRpdXMgKSB7XG5cdFx0aWYoIHRoaXMuc2VhcmNoUmFkaXVzICkge1xuXHRcdFx0dGhpcy5zZWFyY2hSYWRpdXMuc2V0TWFwKCBudWxsICk7XG5cdFx0fVxuXHRcdHRoaXMuc2VhcmNoUmFkaXVzID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZSh7XG5cdFx0XHRzdHJva2VXZWlnaHQ6IDEsXG5cdFx0XHRzdHJva2VDb2xvcjogJyNGRjAwMDAnLFxuXHRcdFx0ZmlsbE9wYWNpdHk6IDAsXG5cdFx0XHRtYXA6IHRoaXMubWFwLFxuXHRcdFx0Y2VudGVyOiB7bGF0LCBsbmd9LFxuXHRcdFx0cmFkaXVzOiByYWRpdXMgKiAxMDAwLFxuXHRcdFx0ZWRpdGFibGU6IHRydWUsXG5cdFx0fSk7XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCB0aGlzLnNlYXJjaFJhZGl1cywgJ3JhZGl1c19jaGFuZ2VkJywgdGhpcy5yYWRpdXNSZXNpemVkLmJpbmQoIHRoaXMgKSApO1xuXHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCB0aGlzLnNlYXJjaFJhZGl1cywgJ2NlbnRlcl9jaGFuZ2VkJywgdGhpcy5yYWRpdXNNb3ZlZC5iaW5kKCB0aGlzICkgKTtcblx0XHRyZXR1cm4gdGhpcy5zZWFyY2hSYWRpdXM7XG5cdH1cblx0XG5cdC8vIENhbGxiYWNrcyBhZnRlciByZXNpemluZyBvciBtb3ZpbmcgYXJvdW5kIHRoZSBzZWFyY2ggYXJlYVxuXHRyYWRpdXNSZXNpemVkKCkge1xuXHRcdGlmKCB0aGlzLnNlYXJjaFJhZGl1cy5nZXRSYWRpdXMoKSA+IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfcmFkaXVzICogMTAwMCApIHtcblx0XHRcdHRoaXMuc2VhcmNoUmFkaXVzLnNldFJhZGl1cyggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF9yYWRpdXMgKiAxMDAwICk7XG5cdFx0fVxuXHRcdHRoaXMuY2hlY2tab29tTGV2ZWwoKTtcblx0fVxuXHRyYWRpdXNNb3ZlZCgpIHtcblx0XHR0aGlzLmNoZWNrWm9vbUxldmVsKCk7XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAuanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNNYXBNYXJrZXIge1xuXHRcblx0Ly8gQ3JlYXRlIG1hcmtlciBhbmQgYWRkIGl0IHRvIHRoZSBwcm92aWRlZCBtYXBcblx0Y29uc3RydWN0b3IoIG1hcCwgbG9jYXRpb24gKSB7XG5cdFx0dGhpcy5tYXAgPSBtYXA7XG5cdFx0dGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXHRcdHRoaXMucG9zaXRpb24gPSB7IGxhdDogbG9jYXRpb24ubGF0LCBsbmc6IGxvY2F0aW9uLmxuZyB9O1xuXHRcdHRoaXMubWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRtYXA6IG1hcC5tYXAsXG5cdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggbG9jYXRpb24ubGF0LCBsb2NhdGlvbi5sbmcgKSxcblx0XHRcdGxhYmVsOiBsb2NhdGlvbi5tYXJrZXJfbGFiZWwsXG5cdFx0fSk7XG5cdFx0dGhpcy5pbmZvV2luZG93ID0gdGhpcy5hZGRJbmZvV2luZG93KCBsb2NhdGlvbi5pbmZvX3dpbmRvdyApO1xuXHRcdHRoaXMuZGVhY3RpdmF0ZSgpO1xuXHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCB0aGlzLm1hcmtlciwgJ2NsaWNrJywgdGhpcy5vbkNsaWNrLmJpbmQoIHRoaXMgKSApO1xuXHR9XG5cdFxuXHQvLyBHZW5lcmF0ZXMgYW4gJ2luZm8gd2luZG93JyB0aGF0IG9wZW5zIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgbWFya2VyXG5cdGFkZEluZm9XaW5kb3coIGNvbnRlbnQgKSB7XG5cdFx0aWYoICFjb250ZW50ICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggdGhpcy5wb3NpdGlvbi5sYXQsIHRoaXMucG9zaXRpb24ubG5nICksXG5cdFx0XHRjb250ZW50OiBjb250ZW50LFxuXHRcdFx0cGl4ZWxPZmZzZXQ6IG5ldyBnb29nbGUubWFwcy5TaXplKCAwLCAtMzAgKSxcblx0XHR9KTtcblx0fVxuXHRcblx0Ly8gQWN0aXZhdGVzIHRoZSBtYXJrZXJcblx0YWN0aXZhdGUoKSB7XG5cdFx0aWYoIHRoaXMubG9jYXRpb24ubWFya2VyX2ltYWdlcyAmJiB0aGlzLmxvY2F0aW9uLm1hcmtlcl9pbWFnZXMuYWN0aXZlICkge1xuXHRcdFx0dGhpcy5yZXBsYWNlSWNvbiggdGhpcy5sb2NhdGlvbi5tYXJrZXJfaW1hZ2VzLmFjdGl2ZSApO1xuXHRcdH1cblx0XHRpZiggdGhpcy5pbmZvV2luZG93ICkge1xuXHRcdFx0dGhpcy5pbmZvV2luZG93Lm9wZW4oIHRoaXMubWFwLm1hcCApO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRGVhY3RpdmF0ZXMgdGhlIG1hcmtlclxuXHRkZWFjdGl2YXRlKCkge1xuXHRcdGlmKCB0aGlzLmxvY2F0aW9uLm1hcmtlcl9pbWFnZXMgJiYgdGhpcy5sb2NhdGlvbi5tYXJrZXJfaW1hZ2VzLmRlZmF1bHQgKSB7XG5cdFx0XHR0aGlzLnJlcGxhY2VJY29uKCB0aGlzLmxvY2F0aW9uLm1hcmtlcl9pbWFnZXMuZGVmYXVsdCApO1xuXHRcdH1cblx0XHRpZiggdGhpcy5pbmZvV2luZG93ICkge1xuXHRcdFx0dGhpcy5pbmZvV2luZG93LmNsb3NlKCk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBDcmVhdGUgYW5kIGFzc2lnbiBhIG5ldyBtYXJrZXIgaWNvbiBmcm9tIHRoZSBwcm92aWRlZCBpbWFnZSBkYXRhXG5cdHJlcGxhY2VJY29uKCBpbWFnZURhdGEgKSB7XG5cdFx0bGV0IGljb25EYXRhID0ge1xuXHRcdFx0dXJsOiBpbWFnZURhdGEudXJsLFxuXHRcdFx0c2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoIGltYWdlRGF0YS5zaXplWzBdLCBpbWFnZURhdGEuc2l6ZVsxXSApLFxuXHRcdFx0c2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoIGltYWdlRGF0YS5zY2FsZWRTaXplWzBdLCBpbWFnZURhdGEuc2NhbGVkU2l6ZVsxXSApLFxuXHRcdFx0b3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoIGltYWdlRGF0YS5vcmlnaW5bMF0sIGltYWdlRGF0YS5vcmlnaW5bMV0gKSxcblx0XHRcdGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KCBpbWFnZURhdGEuYW5jaG9yWzBdLCBpbWFnZURhdGEuYW5jaG9yWzFdICksXG5cdFx0XHRsYWJlbE9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KCBpbWFnZURhdGEubGFiZWxPcmlnaW5bMF0sIGltYWdlRGF0YS5sYWJlbE9yaWdpblsxXSApLFxuXHRcdH07XG5cdFx0dGhpcy5tYXJrZXIuc2V0SWNvbiggaWNvbkRhdGEgKTtcblx0XHRpZiggdGhpcy5pbmZvV2luZG93ICkge1xuXHRcdFx0dGhpcy5pbmZvV2luZG93LnNldE9wdGlvbnMoe1xuXHRcdFx0XHRwaXhlbE9mZnNldDogbmV3IGdvb2dsZS5tYXBzLlNpemUoIDAsICggaWNvbkRhdGEuc2NhbGVkU2l6ZS5oZWlnaHQgKiAtMSApICksXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIERlbGV0ZSBzZWxmXG5cdGRlbGV0ZSgpIHtcblx0XHR0aGlzLmRlYWN0aXZhdGUoKTtcblx0XHR0aGlzLm1hcmtlci5zZXRNYXAoIG51bGwgKTtcblx0fVxuXHRcblx0Ly8gVHJpZ2dlciBhY3Rpb25zIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSBtYXJrZXJcblx0b25DbGljaygpIHtcblx0XHR0aGlzLm1hcC5tYXJrZXJzLmZvckVhY2goIG1hcmtlciA9PiBtYXJrZXIuZGVhY3RpdmF0ZSgpICk7XG5cdFx0dGhpcy5hY3RpdmF0ZSgpO1xuXHR9XG5cdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9jbGFzcy5sb2NhdGlvbnMtbWFwLW1hcmtlci5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc0dlb2xvY2F0aW9uIHtcblx0XG5cdC8vIFJldHVybiBhIHByZXZpb3VzbHkgc2F2ZWQgdXNlciBsb2NhdGlvblxuXHRzdGF0aWMgZ2V0IGNhY2hlZExvY2F0aW9uKCkge1xuXHRcdGlmKCBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCAndXNlckxhdCcgKSA9PT0gbnVsbCB8fCBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCAndXNlckxuZycgKSA9PT0gbnVsbCApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0bGF0OiBwYXJzZUZsb2F0KCBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCAndXNlckxhdCcgKSApLFxuXHRcdFx0bG5nOiBwYXJzZUZsb2F0KCBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCAndXNlckxuZycgKSApLFxuXHRcdH07XG5cdH1cblx0XG5cdC8vIERldGVjdCB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYXRpb24gYW5kIGNhY2hlIGl0XG5cdHN0YXRpYyByZXF1ZXN0TG9jYXRpb24oKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuXHRcdFx0XHRsb2NhdGlvbiA9PiB7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggJ3VzZXJMYXQnLCBsb2NhdGlvbi5jb29yZHMubGF0aXR1ZGUgKTtcblx0XHRcdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCAndXNlckxuZycsIGxvY2F0aW9uLmNvb3Jkcy5sb25naXR1ZGUgKTtcblx0XHRcdFx0XHRyZXNvbHZlKCB0aGlzLmNhY2hlZExvY2F0aW9uICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0XHRyZWplY3QoIEVycm9yKCBlcnJvci5tZXNzYWdlICkgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVuYWJsZUhpZ2hBY2N1cmFjeTogZmFsc2UsXG5cdFx0XHRcdFx0dGltZW91dDogMTAwMDAsXG5cdFx0XHRcdFx0bWF4aW11bUFnZTogMCxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9KTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zR2VvY29kZXIge1xuXHRcblx0Ly8gR2V0IGdlb2NvZGVyIG9iamVjdCAoaW5pdGlhbGl6ZSBvbmx5IG9uY2UpXG5cdHN0YXRpYyBnZXQgZ2VvY29kZXIoKSB7XG5cdFx0ZGVsZXRlIHRoaXMuZ2VvY29kZXI7XG5cdFx0cmV0dXJuIHRoaXMuZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcblx0fVxuXHRcblx0Ly8gcmV2ZXJzZSBnZW9jb2Rpbmdcblx0c3RhdGljIHJldmVyc2VRdWVyeSggbGF0LCBsbmcgKSB7XG5cdFx0Ly8gbGV0IHF1ZXJ5ID0ge31cblx0XHQvLyBxdWVyeS5sb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoIGxhdCwgbG5nICk7XG5cdFx0Ly8gcXVlcnkucGxhY2VJZCA9IHN0cmluZztcblx0fVxuXHRcblx0Ly8gU3VibWl0IGdlb2NvZGluZyBxdWVyeVxuXHRzdGF0aWMgcXVlcnkoIGFkZHJlc3MgKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcblx0XHRcdC8vIFByZXBhcmUgcXVlcnlcblx0XHRcdGxldCBxdWVyeSA9IHt9O1xuXHRcdFx0cXVlcnkuYWRkcmVzcyA9IGFkZHJlc3MudHJpbSgpO1xuXHRcdFx0Ly8gcXVlcnkuYm91bmRzXG5cdFx0XHRxdWVyeS5jb21wb25lbnRSZXN0cmljdGlvbnMgPSB7XG5cdFx0XHRcdC8vIHJvdXRlXG5cdFx0XHRcdC8vIGxvY2FsaXR5XG5cdFx0XHRcdC8vIGFkbWluaXN0cmF0aXZlQXJlYVxuXHRcdFx0XHQvLyBwb3N0YWxDb2RlXG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHQvLyBBcHBseSAnZm9jdXMgY291bnRyeScgZnJvbSB1c2VyIHNldHRpbmdzXG5cdFx0XHRpZiggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX2NvdW50cnkgJiYgIWxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19zdHJpY3QgKSB7XG5cdFx0XHRcdHF1ZXJ5LnJlZ2lvbiA9IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5O1xuXHRcdFx0fVxuXHRcdFx0aWYoIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5ICYmIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19zdHJpY3QgKSB7XG5cdFx0XHRcdHF1ZXJ5LmNvbXBvbmVudFJlc3RyaWN0aW9ucy5jb3VudHJ5ID0gbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX2NvdW50cnk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFZhbGlkYXRlIHF1ZXJ5XG5cdFx0XHRpZiggIXF1ZXJ5LmFkZHJlc3MgKSB7XG5cdFx0XHRcdHJlamVjdCggRXJyb3IoIGxvY3NlYXJjaC5hbGVydHMuZW1wdHlfYWRkcmVzcyApICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFNlbmQgZ2VvY29kZSByZXF1ZXN0XG5cdFx0XHR0aGlzLmdlb2NvZGVyLmdlb2NvZGUoIHF1ZXJ5LCAocmVzdWx0cywgc3RhdHVzKSA9PiB7XG5cdFx0XHRcdGlmKCBzdGF0dXMgIT0gJ09LJyApIHtcblx0XHRcdFx0XHRyZWplY3QoIEVycm9yKCB0aGlzLnRyYW5zbGF0ZUVycm9yKCBzdGF0dXMgKSApICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzb2x2ZSggcmVzdWx0cyApO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXHRcblx0Ly8gQ2hlY2sgZm9yIGVycm9ycyBpbiByZWNlaXZlZCBkYXRhXG5cdHN0YXRpYyB0cmFuc2xhdGVFcnJvciggc3RhdHVzICkge1xuXHRcdGlmKCBzdGF0dXMgPT0gJ0lOVkFMSURfUkVRVUVTVCcgKSB7XG5cdFx0XHRyZXR1cm4gbG9jc2VhcmNoLmFsZXJ0cy5pbnZhbGlkX3JlcXVlc3Q7XG5cdFx0fSBlbHNlIGlmKCBzdGF0dXMgPT0gJ09WRVJfUVVFUllfTElNSVQnICkge1xuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMucXVlcnlfbGltaXQ7XG5cdFx0fSBlbHNlIGlmKCBzdGF0dXMgPT0gJ1pFUk9fUkVTVUxUUycgKSB7XG5cdFx0XHRyZXR1cm4gbG9jc2VhcmNoLmFsZXJ0cy5ub19yZXN1bHRzO1xuXHRcdH0gZWxzZSBpZiggc3RhdHVzICE9ICdPSycgKSB7XG5cdFx0XHQvLyBVTktOT1dOX0VSUk9SIGFuZCBSRVFVRVNUX0RFTklFRFxuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMudW5rbm93bl9lcnJvcjtcblx0XHR9XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1nZW9jb2Rlci5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc0RhdGFiYXNlIHtcblx0XG5cdC8vIEdldHMgdXNlZnVsIGluZm8gZnJvbSBhIGdlb2NvZGUgcmVzdWx0IHRvIGJlIHVzZWQgb24gdGhlIGRiIHF1ZXJ5XG5cdHN0YXRpYyBnZXRHZW9jb2RlRGF0YSggcmVzdWx0ICkge1xuXHRcdGxldCBkYl9maWVsZHMgPSB7XG5cdFx0XHQnY291bnRyeSc6ICdjb3VudHJ5Jyxcblx0XHRcdCdhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzEnOiAnc3RhdGUnLFxuXHRcdFx0J3Bvc3RhbF9jb2RlJzogJ3Bvc3Rjb2RlJyxcblx0XHRcdCdsb2NhbGl0eSc6ICdjaXR5Jyxcblx0XHR9O1xuXHRcdGxldCByZXN1bHRfdHlwZSA9IHJlc3VsdC50eXBlcy5maW5kKCB0eXBlID0+IGRiX2ZpZWxkc1t0eXBlXSApO1xuXHRcdGlmKCByZXN1bHRfdHlwZSApIHtcblx0XHRcdGxldCByZXN1bHRfZGF0YSA9IHJlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHMuZmluZCggY29tcG9uZW50ID0+IGNvbXBvbmVudC50eXBlcy5pbmNsdWRlcyggcmVzdWx0X3R5cGUgKSApO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29kZTogcmVzdWx0X2RhdGEuc2hvcnRfbmFtZSxcblx0XHRcdFx0bmFtZTogcmVzdWx0X2RhdGEubG9uZ19uYW1lLFxuXHRcdFx0XHRmaWVsZDogZGJfZmllbGRzW3Jlc3VsdF90eXBlXSxcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0XG5cdC8vIFN1Ym1pdCBhIGRhdGFiYXNlIHF1ZXJ5XG5cdHN0YXRpYyBxdWVyeSggbGF0LCBsbmcsIHJhZGl1cyApIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFxuXHRcdFx0Ly8gUHJlcGFyZSBxdWVyeVxuXHRcdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0XHQnYWN0aW9uJzogJ2xvY2F0aW9uc19zZWFyY2gnLFxuXHRcdFx0XHRsYXQsXG5cdFx0XHRcdGxuZyxcblx0XHRcdFx0c2VhcmNoX3JhZGl1czogcmFkaXVzLFxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0aWYoIHR5cGVvZiBmZXRjaCA9PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHQvLyBJZiBmZXRjaCBpcyBhdmFpbGFibGUsIHVzZSBpdFxuXHRcdFx0XHRsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcblx0XHRcdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRcdGZvciggbGV0IGtleSBpbiBxdWVyeSApIHtcblx0XHRcdFx0XHRpZiggcXVlcnkuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xuXHRcdFx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCBrZXksIHF1ZXJ5W2tleV0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZmV0Y2goIGxvY3NlYXJjaC5hamF4X3VybCwge21ldGhvZDogJ1BPU1QnLCBoZWFkZXJzLCBib2R5OiBmb3JtRGF0YX0gKVxuXHRcdFx0XHRcdC50aGVuKCByZXN1bHQgPT4ge1xuXHRcdFx0XHRcdFx0aWYoICFyZXN1bHQub2sgKSByZWplY3QoIEVycm9yKCByZXN1bHQuc3RhdHVzVGV4dCApICk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0Lmpzb24oKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKCByZXNvbHZlICkuY2F0Y2goIHJlamVjdCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGZhbGxiYWNrIHRvIGpRdWVyeVxuXHRcdFx0XHRqUXVlcnkucG9zdCh7XG5cdFx0XHRcdFx0dXJsOiAgICAgIGxvY3NlYXJjaC5hamF4X3VybCxcblx0XHRcdFx0XHRkYXRhOiAgICAgcXVlcnksXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oIGpxWEhSLCBzdGF0dXMsIGVycm9yICkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KCBFcnJvciggYEVycm9yOiAke2Vycm9yfWAgKSApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIGxvY2F0aW9ucywgc3RhdHVzLCBqcVhIUiApIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoIGxvY2F0aW9ucyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fSk7XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1kYXRhYmFzZS5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZWRpdC1zY3JlZW4uc2Nzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vX3NyYy9zY3NzL2VkaXQtc2V0dGluZ3Muc2Nzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vX3NyYy9zY3NzL2Zyb250ZW5kLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==