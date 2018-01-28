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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzM0MWY0YTRiMjg2NzUzM2E1YjciLCJ3ZWJwYWNrOi8vLy4vX3NyYy9qcy9zaG9ydGNvZGVzLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzP2VjNjciLCJ3ZWJwYWNrOi8vLy4vX3NyYy9zY3NzL2VkaXQtc2V0dGluZ3Muc2Nzcz82NTU0Iiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzU0ODAiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJnb29nbGUiLCJhbGVydCIsImxvY3NlYXJjaCIsImFsZXJ0cyIsImFwaV91bmF2YWlsYWJsZSIsImVhY2giLCJtYXAiLCJhZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyIsImRhdGEiLCJib3giLCJmb3JtIiwiZmluZCIsIm1lc3NhZ2VzQm94IiwicmVzdWx0c0JveCIsIm1hcEJveCIsImFkZHJlc3NGaWVsZCIsImxvY2tTZWFyY2giLCJhZGRDbGFzcyIsInByb3AiLCJ1bmxvY2tTZWFyY2giLCJyZW1vdmVDbGFzcyIsInVzZXJMb2NhdGlvbkRldGVjdGVkIiwibGF0TG5nIiwiZGF0YWJhc2VSZXF1ZXN0IiwibGF0IiwibG5nIiwibWFwX2F0dHJpYnV0ZXMiLCJzZWFyY2hfcmFkaXVzIiwidGV4dCIsInlvdXJfbG9jYXRpb24iLCJyZXF1ZXN0VXNlckxvY2F0aW9uIiwidmFsIiwidHJpbSIsIkxvY2F0aW9uc0dlb2xvY2F0aW9uIiwicmVxdWVzdExvY2F0aW9uIiwidGhlbiIsImNhdGNoIiwiZ2VvY29kZVJlcXVlc3QiLCJhZGRyZXNzIiwiTG9jYXRpb25zR2VvY29kZXIiLCJxdWVyeSIsImZpbmFsbHkiLCJnZW9jb2RlUmVzcG9uc2UiLCJlIiwibWVzc2FnZSIsInJlc3VsdHMiLCJsZW5ndGgiLCJzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlIiwic2hvd0dlb2NvZGVBbHRlcm5hdGl2ZXMiLCJyZXN1bHQiLCJnZW9tZXRyeSIsImxvY2F0aW9uIiwiZm9ybWF0dGVkX2FkZHJlc3MiLCJodG1sIiwiZGlkX3lvdV9tZWFuIiwibGlzdCIsImZvckVhY2giLCJpdGVtIiwibGluayIsImhyZWYiLCJvbiIsInByZXZlbnREZWZhdWx0IiwiYXBwZW5kIiwicmFkaXVzIiwicmVmZXJlbmNlVGV4dCIsIm5ld1JhZGl1cyIsInNlYXJjaGluZ19uZWFyIiwibWFwUmFkaXVzIiwiZHJhd1JhZGl1cyIsIm9uUmFkaXVzQ2hhbmdlIiwiZ2V0Q2VudGVyIiwiZ2V0UmFkaXVzIiwibWFwcyIsImV2ZW50IiwiYWRkTGlzdGVuZXIiLCJMb2NhdGlvbnNEYXRhYmFzZSIsImRhdGFiYXNlUmVzcG9uc2UiLCJsb2NhdGlvbnMiLCJtYW55X3Jlc3VsdHMiLCJyZXBsYWNlIiwiZW1wdHkiLCJsaXN0X2l0ZW0iLCJsaXN0SXRlbSIsIm1hcmtlciIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJwb3NpdGlvbiIsInRvcCIsImNoaWxkcmVuIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsInRyaWdnZXIiLCJjYWNoZWRMb2NhdGlvbiIsIkxvY2F0aW9uc01hcCIsImNvbnRhaW5lciIsIk1hcCIsInN0eWxlcyIsIm1hcmtlcnMiLCJNYXJrZXJDbHVzdGVyZXIiLCJjbHVzdGVyc19pbWFnZSIsIm1hcmtlckNsdXN0ZXJlciIsInJlc2V0TWFwTG9jYXRpb24iLCJzZXRDZW50ZXIiLCJpbml0aWFsX2xhdCIsImluaXRpYWxfbG5nIiwic2V0Wm9vbSIsIm1heF96b29tIiwibmV3Qm91bmRzIiwic2VhcmNoUmFkaXVzIiwiZ2V0Qm91bmRzIiwiTGF0TG5nQm91bmRzIiwiZXh0ZW5kIiwibSIsImdldFBvc2l0aW9uIiwiZml0Qm91bmRzIiwiZ2V0Wm9vbSIsInJlbW92ZUFsbE1hcmtlcnMiLCJhZGRNYXJrZXJGcm9tTG9jYXRpb24iLCJiaW5kIiwiY2hlY2tab29tTGV2ZWwiLCJuZXdNYXJrZXIiLCJhZGRNYXJrZXIiLCJkZWxldGUiLCJjbGVhck1hcmtlcnMiLCJzZXRNYXAiLCJDaXJjbGUiLCJzdHJva2VXZWlnaHQiLCJzdHJva2VDb2xvciIsImZpbGxPcGFjaXR5IiwiY2VudGVyIiwiZWRpdGFibGUiLCJyYWRpdXNSZXNpemVkIiwicmFkaXVzTW92ZWQiLCJtYXhfcmFkaXVzIiwic2V0UmFkaXVzIiwiTG9jYXRpb25zTWFwTWFya2VyIiwiTWFya2VyIiwiTGF0TG5nIiwibGFiZWwiLCJtYXJrZXJfbGFiZWwiLCJpbmZvV2luZG93IiwiYWRkSW5mb1dpbmRvdyIsImluZm9fd2luZG93IiwiZGVhY3RpdmF0ZSIsIm9uQ2xpY2siLCJjb250ZW50IiwiSW5mb1dpbmRvdyIsInBpeGVsT2Zmc2V0IiwiU2l6ZSIsIm1hcmtlcl9pbWFnZXMiLCJhY3RpdmUiLCJyZXBsYWNlSWNvbiIsIm9wZW4iLCJkZWZhdWx0IiwiY2xvc2UiLCJpbWFnZURhdGEiLCJpY29uRGF0YSIsInVybCIsInNpemUiLCJzY2FsZWRTaXplIiwib3JpZ2luIiwiUG9pbnQiLCJhbmNob3IiLCJsYWJlbE9yaWdpbiIsInNldEljb24iLCJzZXRPcHRpb25zIiwiaGVpZ2h0IiwiYWN0aXZhdGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwic2Vzc2lvblN0b3JhZ2UiLCJzZXRJdGVtIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJFcnJvciIsImVycm9yIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJnZXRJdGVtIiwicGFyc2VGbG9hdCIsImNvbXBvbmVudFJlc3RyaWN0aW9ucyIsImZvY3VzX2NvdW50cnkiLCJmb2N1c19zdHJpY3QiLCJyZWdpb24iLCJjb3VudHJ5IiwiZW1wdHlfYWRkcmVzcyIsImdlb2NvZGVyIiwiZ2VvY29kZSIsInN0YXR1cyIsInRyYW5zbGF0ZUVycm9yIiwiaW52YWxpZF9yZXF1ZXN0IiwicXVlcnlfbGltaXQiLCJub19yZXN1bHRzIiwidW5rbm93bl9lcnJvciIsIkdlb2NvZGVyIiwiZGJfZmllbGRzIiwicmVzdWx0X3R5cGUiLCJ0eXBlcyIsInR5cGUiLCJyZXN1bHRfZGF0YSIsImFkZHJlc3NfY29tcG9uZW50cyIsImNvbXBvbmVudCIsImluY2x1ZGVzIiwiY29kZSIsInNob3J0X25hbWUiLCJuYW1lIiwibG9uZ19uYW1lIiwiZmllbGQiLCJmZXRjaCIsImhlYWRlcnMiLCJIZWFkZXJzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImtleSIsImhhc093blByb3BlcnR5IiwiYWpheF91cmwiLCJtZXRob2QiLCJib2R5Iiwib2siLCJzdGF0dXNUZXh0IiwianNvbiIsInBvc3QiLCJkYXRhVHlwZSIsImpxWEhSIiwic3VjY2VzcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztB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UCxDQUFZO0FBQ1h0RSxXQUFVNUosVUFBVTROLFFBRFQ7QUFFWHROLFlBQVVnQyxLQUZDO0FBR1g2TCxnQkFBVSxNQUhDO0FBSVhoRCxhQUFPLGVBQVVpRCxLQUFWLEVBQWlCbkMsTUFBakIsRUFBeUJkLE1BQXpCLEVBQWlDO0FBQ3ZDVixjQUFRUyxrQkFBaUJDLE1BQWpCLENBQVI7QUFDQSxPQU5VO0FBT1hrRCxlQUFTLGlCQUFVMUosU0FBVixFQUFxQnNILE1BQXJCLEVBQTZCbUMsS0FBN0IsRUFBcUM7QUFDN0M1RCxlQUFTN0YsU0FBVDtBQUNBO0FBVFUsTUFBWjtBQVdBO0FBRUQsSUF4Q00sQ0FBUDtBQXlDQTs7Ozs7O3lEQWpFbUJGLGlCOzs7Ozs7QUNBckIseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSx5QyIsImZpbGUiOiIvYXNzZXRzL2pzL3Nob3J0Y29kZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3MzQxZjRhNGIyODY3NTMzYTViNyIsImltcG9ydCBMb2NhdGlvbnNNYXAgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtbWFwLmpzJztcbmltcG9ydCBMb2NhdGlvbnNHZW9sb2NhdGlvbiBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1nZW9sb2NhdGlvbi5qcyc7XG5pbXBvcnQgTG9jYXRpb25zR2VvY29kZXIgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtZ2VvY29kZXIuanMnO1xuaW1wb3J0IExvY2F0aW9uc0RhdGFiYXNlIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzJztcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oJCl7XG5cdFxuXHQvLyBDaGVjayBHb29nbGUgTWFwcyBBUElcblx0aWYoIHR5cGVvZiBnb29nbGUgIT09ICdvYmplY3QnICkge1xuXHRcdGFsZXJ0KCBsb2NzZWFyY2guYWxlcnRzLmFwaV91bmF2YWlsYWJsZSApO1xuXHRcdHJldHVybjtcblx0fVxuXHRcblx0Ly8gR2VuZXJhdGUgbG9jYXRpb25zIG1hcHNcblx0JCgnLmxvY3NlYXJjaF9tYXAnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0bGV0IG1hcCA9IG5ldyBMb2NhdGlvbnNNYXAoIHRoaXMgKTtcblx0XHRtYXAuYWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMoICQodGhpcykuZGF0YSgnbG9jYXRpb25zJykgKTtcblx0fSk7XG5cdFxuXHQvLyBJbml0aWFsaXplIHNlYXJjaCBib3hlc1xuXHQkKCcubG9jc2VhcmNoX2JveCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcblx0XHRcblx0XHQvLyBJbml0IG9iamVjdHNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRsZXQgYm94ID0gJCh0aGlzKTtcblx0XHRsZXQgZm9ybSA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fZm9ybScpO1xuXHRcdGxldCBtZXNzYWdlc0JveCA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fbWVzc2FnZXMnKTtcblx0XHRsZXQgcmVzdWx0c0JveCA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fcmVzdWx0cycpO1xuXHRcdGxldCBtYXBCb3ggPSBib3guZmluZCgnLmxvY3NlYXJjaF9ib3hfX21hcCcpO1xuXHRcdGxldCBhZGRyZXNzRmllbGQgPSBmb3JtLmZpbmQoICdpbnB1dFtuYW1lPWFkZHJlc3NdJyApO1xuXHRcdGxldCBtYXAgPSBuZXcgTG9jYXRpb25zTWFwKCBtYXBCb3hbMF0gKTtcblx0XHRcblx0XHRcblx0XHQvLyBJbml0IGZ1bmN0aW9uc1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdC8vIExvY2svdW5sb2NrIHNlYXJjaCBib3hcblx0XHRmdW5jdGlvbiBsb2NrU2VhcmNoKCkge1xuXHRcdFx0Ym94LmRhdGEoICdpc0xvY2tlZCcsIHRydWUgKTtcblx0XHRcdGJveC5hZGRDbGFzcyggJ2xvY3NlYXJjaF9ib3gtLWxvYWRpbmcnICk7XG5cdFx0XHRib3guZmluZCggJzppbnB1dCcgKS5wcm9wKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVubG9ja1NlYXJjaCgpIHtcblx0XHRcdGJveC5kYXRhKCAnaXNMb2NrZWQnLCBmYWxzZSApO1xuXHRcdFx0Ym94LnJlbW92ZUNsYXNzKCAnbG9jc2VhcmNoX2JveC0tbG9hZGluZycgKTtcblx0XHRcdGJveC5maW5kKCAnOmlucHV0JyApLnByb3AoICdkaXNhYmxlZCcsIGZhbHNlICk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFNlYXJjaCBkYXRhYmFzZSBiYXNlZCBvbiB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYXRpb25cblx0XHRmdW5jdGlvbiB1c2VyTG9jYXRpb25EZXRlY3RlZCggbGF0TG5nICkge1xuXHRcdFx0ZGF0YWJhc2VSZXF1ZXN0KCBsYXRMbmcubGF0LCBsYXRMbmcubG5nLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc2VhcmNoX3JhZGl1cywgbG9jc2VhcmNoLnRleHQueW91cl9sb2NhdGlvbiApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXF1ZXN0VXNlckxvY2F0aW9uKCkge1xuXHRcdFx0aWYoIGFkZHJlc3NGaWVsZC52YWwoKS50cmltKCkgPT0gJycgKSB7XG5cdFx0XHRcdExvY2F0aW9uc0dlb2xvY2F0aW9uLnJlcXVlc3RMb2NhdGlvbigpXG5cdFx0XHRcdFx0LnRoZW4oIHVzZXJMb2NhdGlvbkRldGVjdGVkIClcblx0XHRcdFx0XHQuY2F0Y2goIGU9Pnt9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFVzZSBnZW9jb2RpbmcgdG8gY29udmVydCBhZGRyZXNzZXMgaW50byBjb29yZGluYXRlc1xuXHRcdGZ1bmN0aW9uIGdlb2NvZGVSZXF1ZXN0KCBhZGRyZXNzICkge1xuXHRcdFx0aWYoIGJveC5kYXRhKCAnaXNMb2NrZWQnICkgKSByZXR1cm47XG5cdFx0XHRsb2NrU2VhcmNoKCk7XG5cdFx0XHRMb2NhdGlvbnNHZW9jb2Rlci5xdWVyeSggYWRkcmVzcyApXG5cdFx0XHRcdC5maW5hbGx5KCB1bmxvY2tTZWFyY2ggKVxuXHRcdFx0XHQudGhlbiggZ2VvY29kZVJlc3BvbnNlIClcblx0XHRcdFx0LmNhdGNoKCBlID0+IGFsZXJ0KCBgRXJyb3I6ICR7ZS5tZXNzYWdlfWAgKSApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZW9jb2RlUmVzcG9uc2UoIHJlc3VsdHMgKSB7XG5cdFx0XHRpZiggcmVzdWx0cy5sZW5ndGggPT09IDEgKSB7XG5cdFx0XHRcdHNlYXJjaERhdGFiYXNlRnJvbUdlb2NvZGUoIHJlc3VsdHNbMF0gKTtcblx0XHRcdH0gZWxzZSBpZiggcmVzdWx0cy5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRzaG93R2VvY29kZUFsdGVybmF0aXZlcyggcmVzdWx0cyApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlKCByZXN1bHQgKSB7XG5cdFx0XHRkYXRhYmFzZVJlcXVlc3QoIHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKSwgcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc2VhcmNoX3JhZGl1cywgcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dHZW9jb2RlQWx0ZXJuYXRpdmVzKCByZXN1bHRzICkge1xuXHRcdFx0bWVzc2FnZXNCb3guaHRtbCggJzxwPicrbG9jc2VhcmNoLnRleHQuZGlkX3lvdV9tZWFuKyc8L3A+JyApO1xuXHRcdFx0bGV0IGxpc3QgPSAkKCc8dWw+Jyk7XG5cdFx0XHRyZXN1bHRzLmZvckVhY2goIHJlc3VsdCA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gJCgnPGxpPicpO1xuXHRcdFx0XHRsZXQgbGluayA9ICQoJzxhPicseyBocmVmOiAnIycsIHRleHQ6IHJlc3VsdC5mb3JtYXR0ZWRfYWRkcmVzcyB9KTtcblx0XHRcdFx0bGluay5vbiggJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2VhcmNoRGF0YWJhc2VGcm9tR2VvY29kZSggcmVzdWx0ICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsaXN0LmFwcGVuZCggaXRlbS5hcHBlbmQoIGxpbmsgKSApO1xuXHRcdFx0fSk7XG5cdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoIGxpc3QgKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gRGF0YWJhc2UgcmVzdWx0c1xuXHRcdGZ1bmN0aW9uIGRhdGFiYXNlUmVxdWVzdCggbGF0LCBsbmcsIHJhZGl1cywgcmVmZXJlbmNlVGV4dCwgbmV3UmFkaXVzPXRydWUgKSB7XG5cdFx0XHRpZiggYm94LmRhdGEoICdpc0xvY2tlZCcgKSApIHJldHVybjtcblx0XHRcdGxvY2tTZWFyY2goKTtcblx0XHRcdG1lc3NhZ2VzQm94Lmh0bWwoIHJlZmVyZW5jZVRleHQgPyBgPHA+JHtsb2NzZWFyY2gudGV4dC5zZWFyY2hpbmdfbmVhcn0gJHtyZWZlcmVuY2VUZXh0fTwvcD5gIDogJycgKTtcblx0XHRcdFxuXHRcdFx0Ly8gRHJhdyBhIG5ldyByYWRpdXMgYXJlYSwgYW5kIHJlLXN1Ym1pdCBkYXRhYmFzZSBxdWVyeSBpZiB0aGUgdXNlciByZXNpemVzIG9yIG1vdmVzIHRoZSByYWRpdXNcblx0XHRcdGlmKCBuZXdSYWRpdXMgKSB7XG5cdFx0XHRcdGxldCBtYXBSYWRpdXMgPSBtYXAuZHJhd1JhZGl1cyggbGF0LCBsbmcsIHJhZGl1cyApO1xuXHRcdFx0XHRsZXQgb25SYWRpdXNDaGFuZ2UgPSAoKT0+e1xuXHRcdFx0XHRcdGRhdGFiYXNlUmVxdWVzdCggbWFwUmFkaXVzLmdldENlbnRlcigpLmxhdCgpLCBtYXBSYWRpdXMuZ2V0Q2VudGVyKCkubG5nKCksIG1hcFJhZGl1cy5nZXRSYWRpdXMoKS8xMDAwLCAnJywgZmFsc2UgKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIG1hcFJhZGl1cywgJ3JhZGl1c19jaGFuZ2VkJywgb25SYWRpdXNDaGFuZ2UgKTtcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIG1hcFJhZGl1cywgJ2NlbnRlcl9jaGFuZ2VkJywgb25SYWRpdXNDaGFuZ2UgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gU3VibWl0IGRhdGFiYXNlIHF1ZXJ5XG5cdFx0XHRMb2NhdGlvbnNEYXRhYmFzZS5xdWVyeSggbGF0LCBsbmcsIHJhZGl1cyApXG5cdFx0XHRcdC5maW5hbGx5KCB1bmxvY2tTZWFyY2ggKVxuXHRcdFx0XHQudGhlbiggZGF0YWJhc2VSZXNwb25zZSApXG5cdFx0XHRcdC5jYXRjaCggZSA9PiBhbGVydCggYEVycm9yOiAke2UubWVzc2FnZX1gICkgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZGF0YWJhc2VSZXNwb25zZSggbG9jYXRpb25zICkge1xuXHRcdFx0aWYoICFsb2NhdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoICc8cD4nK2xvY3NlYXJjaC50ZXh0WycwX3Jlc3VsdHMnXSsnPC9wPicgKTtcblx0XHRcdH0gZWxzZSBpZiggbG9jYXRpb25zLmxlbmd0aCA9PSAxICkge1xuXHRcdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoICc8cD4nK2xvY3NlYXJjaC50ZXh0WycxX3Jlc3VsdCddKyc8L3A+JyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZXNCb3guYXBwZW5kKCAnPHA+Jytsb2NzZWFyY2gudGV4dC5tYW55X3Jlc3VsdHMucmVwbGFjZSggJyVzJywgbG9jYXRpb25zLmxlbmd0aCApICsnPC9wPicgKTtcblx0XHRcdH1cblx0XHRcdG1hcC5hZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyggbG9jYXRpb25zICk7XG5cdFx0XHRcblx0XHRcdC8vIFVwZGF0ZSByZXN1bHRzIGxpc3Rcblx0XHRcdHJlc3VsdHNCb3guZW1wdHkoKTtcblx0XHRcdGxvY2F0aW9ucy5mb3JFYWNoKCBsb2NhdGlvbiA9PiB7XG5cdFx0XHRcdGlmKCAhbG9jYXRpb24ubGlzdF9pdGVtICkgcmV0dXJuO1xuXHRcdFx0XHRsZXQgbGlzdEl0ZW0gPSAkKGxvY2F0aW9uLmxpc3RfaXRlbSk7XG5cdFx0XHRcdHJlc3VsdHNCb3guYXBwZW5kKCBsaXN0SXRlbSApO1xuXHRcdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggbG9jYXRpb24ubWFya2VyLm1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRcdHJlc3VsdHNCb3guYW5pbWF0ZSh7IHNjcm9sbFRvcDogcmVzdWx0c0JveC5zY3JvbGxUb3AoKSArIGxpc3RJdGVtLnBvc2l0aW9uKCkudG9wIH0pO1xuXHRcdFx0XHRcdHJlc3VsdHNCb3guY2hpbGRyZW4oICcubG9jc2VhcmNoX2JveF9fcmVzdWx0JyApLnJlbW92ZUNsYXNzKCAnbG9jc2VhcmNoX2JveF9fcmVzdWx0LS1zZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRsaXN0SXRlbS5hZGRDbGFzcyggJ2xvY3NlYXJjaF9ib3hfX3Jlc3VsdC0tc2VsZWN0ZWQnICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsaXN0SXRlbS5vbiggJ2NsaWNrJywgZSA9PiB7XG5cdFx0XHRcdFx0aWYoIGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2EnICkgcmV0dXJuO1xuXHRcdFx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoIGxvY2F0aW9uLm1hcmtlci5tYXJrZXIsICdjbGljaycgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0Ly8gSGFuZGxlIHVzZXIgYWN0aW9uc1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdC8vIEZvcm0gc3VibWlzc2lvblxuXHRcdGZvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbihlKXtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGdlb2NvZGVSZXF1ZXN0KCBhZGRyZXNzRmllbGQudmFsKCkgKTtcblx0XHR9KTtcblx0XHRcblx0XHQvLyBUcmlnZ2VyIGF1dG9tYXRpYyBzZWFyY2hlc1xuXHRcdGlmKCBmb3JtLmRhdGEoICdsb2NzZWFyY2gtYXV0b3NlYXJjaCcgKSApIHtcblx0XHRcdGZvcm0udHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHR9IGVsc2UgaWYoIExvY2F0aW9uc0dlb2xvY2F0aW9uLmNhY2hlZExvY2F0aW9uICkge1xuXHRcdFx0dXNlckxvY2F0aW9uRGV0ZWN0ZWQoIExvY2F0aW9uc0dlb2xvY2F0aW9uLmNhY2hlZExvY2F0aW9uICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcXVlc3RVc2VyTG9jYXRpb24oKTtcblx0XHR9XG5cdFx0XG5cdFx0XG5cdH0pO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL3Nob3J0Y29kZXMuanMiLCJpbXBvcnQgTG9jYXRpb25zTWFwTWFya2VyIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLW1hcC1tYXJrZXIuanMnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zTWFwIHtcblx0XG5cdC8vIENyZWF0ZSBtYXAgYW5kIHNldCBkZWZhdWx0IGF0dHJpYnV0ZXNcblx0Y29uc3RydWN0b3IoIGNvbnRhaW5lciApIHtcblx0XHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblx0XHR0aGlzLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoIGNvbnRhaW5lciwge1xuXHRcdFx0c3R5bGVzOiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc3R5bGVzLFxuXHRcdH0pO1xuXHRcdHRoaXMubWFya2VycyA9IFtdO1xuXHRcdGlmKCB0eXBlb2YgTWFya2VyQ2x1c3RlcmVyID09PSAnZnVuY3Rpb24nICYmIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5jbHVzdGVyc19pbWFnZSApIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyID0gbmV3IE1hcmtlckNsdXN0ZXJlciggdGhpcy5tYXAsIFtdLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuY2x1c3RlcnNfaW1hZ2UgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBudWxsO1xuXHRcdH1cblx0XHR0aGlzLnJlc2V0TWFwTG9jYXRpb24oKTtcblx0fVxuXHRcblx0Ly8gU2V0cyB0aGUgbWFwIHRvIHRoZSBkZWZhdWx0IGxvY2F0aW9uXG5cdHJlc2V0TWFwTG9jYXRpb24oKSB7XG5cdFx0dGhpcy5tYXAuc2V0Q2VudGVyKHtcblx0XHRcdGxhdDogbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmluaXRpYWxfbGF0LFxuXHRcdFx0bG5nOiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuaW5pdGlhbF9sbmcsXG5cdFx0fSk7XG5cdFx0dGhpcy5tYXAuc2V0Wm9vbSggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF96b29tICk7XG5cdH1cblx0XG5cdC8vIEVuZm9yY2UgbWF4IHpvb20gbGV2ZWxcblx0Y2hlY2tab29tTGV2ZWwoKSB7XG5cdFx0bGV0IG5ld0JvdW5kcyA9IHRoaXMuc2VhcmNoUmFkaXVzID8gdGhpcy5zZWFyY2hSYWRpdXMuZ2V0Qm91bmRzKCkgOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG5cdFx0dGhpcy5tYXJrZXJzLmZvckVhY2goIG0gPT4geyBuZXdCb3VuZHMuZXh0ZW5kKCBtLm1hcmtlci5nZXRQb3NpdGlvbigpICkgfSApO1xuXHRcdHRoaXMubWFwLmZpdEJvdW5kcyggbmV3Qm91bmRzICk7XG5cdFx0aWYoIHRoaXMubWFwLmdldFpvb20oKSA+IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfem9vbSApIHtcblx0XHRcdHRoaXMubWFwLnNldFpvb20oIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfem9vbSApO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gQ3JlYXRlIGFuZCBhZGQgbWFya2VycyBmcm9tIGEgbGlzdCBvZiBsb2NhdGlvbnMgKGRlbGV0ZXMgYWxsIHByZXZpb3VzIG1hcmtlcnMpXG5cdGFkZE1hcmtlcnNGcm9tTG9jYXRpb25zKCBsb2NhdGlvbnMgKSB7XG5cdFx0dGhpcy5yZW1vdmVBbGxNYXJrZXJzKCk7XG5cdFx0dGhpcy5tYXJrZXJzID0gbG9jYXRpb25zLm1hcCggdGhpcy5hZGRNYXJrZXJGcm9tTG9jYXRpb24uYmluZCggdGhpcyApICk7XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHR9XG5cdGFkZE1hcmtlckZyb21Mb2NhdGlvbiggbG9jYXRpb24gKSB7XG5cdFx0bGV0IG5ld01hcmtlciA9IG5ldyBMb2NhdGlvbnNNYXBNYXJrZXIoIHRoaXMsIGxvY2F0aW9uICk7XG5cdFx0aWYoIHRoaXMubWFya2VyQ2x1c3RlcmVyICkge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2VyKCBuZXdNYXJrZXIubWFya2VyICk7XG5cdFx0fVxuXHRcdGxvY2F0aW9uLm1hcmtlciA9IG5ld01hcmtlcjtcblx0XHRyZXR1cm4gbmV3TWFya2VyO1xuXHR9XG5cdFxuXHQvLyBEZWxldGUgYWxsIGV4aXN0aW5nIG1hcmtlcnNcblx0cmVtb3ZlQWxsTWFya2VycygpIHtcblx0XHR0aGlzLm1hcmtlcnMuZm9yRWFjaCggbWFya2VyID0+IG1hcmtlci5kZWxldGUoKSApO1xuXHRcdHRoaXMubWFya2VycyA9IFtdO1xuXHRcdGlmKCB0aGlzLm1hcmtlckNsdXN0ZXJlciApIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyLmNsZWFyTWFya2VycygpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRHJhdyBzZWFyY2ggcmFkaXVzIG9uIHRoZSBtYXBcblx0ZHJhd1JhZGl1cyggbGF0LCBsbmcsIHJhZGl1cyApIHtcblx0XHRpZiggdGhpcy5zZWFyY2hSYWRpdXMgKSB7XG5cdFx0XHR0aGlzLnNlYXJjaFJhZGl1cy5zZXRNYXAoIG51bGwgKTtcblx0XHR9XG5cdFx0dGhpcy5zZWFyY2hSYWRpdXMgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcblx0XHRcdHN0cm9rZVdlaWdodDogMSxcblx0XHRcdHN0cm9rZUNvbG9yOiAnI0ZGMDAwMCcsXG5cdFx0XHRmaWxsT3BhY2l0eTogMCxcblx0XHRcdG1hcDogdGhpcy5tYXAsXG5cdFx0XHRjZW50ZXI6IHtsYXQsIGxuZ30sXG5cdFx0XHRyYWRpdXM6IHJhZGl1cyAqIDEwMDAsXG5cdFx0XHRlZGl0YWJsZTogdHJ1ZSxcblx0XHR9KTtcblx0XHR0aGlzLmNoZWNrWm9vbUxldmVsKCk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMuc2VhcmNoUmFkaXVzLCAncmFkaXVzX2NoYW5nZWQnLCB0aGlzLnJhZGl1c1Jlc2l6ZWQuYmluZCggdGhpcyApICk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMuc2VhcmNoUmFkaXVzLCAnY2VudGVyX2NoYW5nZWQnLCB0aGlzLnJhZGl1c01vdmVkLmJpbmQoIHRoaXMgKSApO1xuXHRcdHJldHVybiB0aGlzLnNlYXJjaFJhZGl1cztcblx0fVxuXHRcblx0Ly8gQ2FsbGJhY2tzIGFmdGVyIHJlc2l6aW5nIG9yIG1vdmluZyBhcm91bmQgdGhlIHNlYXJjaCBhcmVhXG5cdHJhZGl1c1Jlc2l6ZWQoKSB7XG5cdFx0aWYoIHRoaXMuc2VhcmNoUmFkaXVzLmdldFJhZGl1cygpID4gbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF9yYWRpdXMgKiAxMDAwICkge1xuXHRcdFx0dGhpcy5zZWFyY2hSYWRpdXMuc2V0UmFkaXVzKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3JhZGl1cyAqIDEwMDAgKTtcblx0XHR9XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHR9XG5cdHJhZGl1c01vdmVkKCkge1xuXHRcdHRoaXMuY2hlY2tab29tTGV2ZWwoKTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc01hcE1hcmtlciB7XG5cdFxuXHQvLyBDcmVhdGUgbWFya2VyIGFuZCBhZGQgaXQgdG8gdGhlIHByb3ZpZGVkIG1hcFxuXHRjb25zdHJ1Y3RvciggbWFwLCBsb2NhdGlvbiApIHtcblx0XHR0aGlzLm1hcCA9IG1hcDtcblx0XHR0aGlzLmxvY2F0aW9uID0gbG9jYXRpb247XG5cdFx0dGhpcy5wb3NpdGlvbiA9IHsgbGF0OiBsb2NhdGlvbi5sYXQsIGxuZzogbG9jYXRpb24ubG5nIH07XG5cdFx0dGhpcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdG1hcDogbWFwLm1hcCxcblx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCBsb2NhdGlvbi5sYXQsIGxvY2F0aW9uLmxuZyApLFxuXHRcdFx0bGFiZWw6IGxvY2F0aW9uLm1hcmtlcl9sYWJlbCxcblx0XHR9KTtcblx0XHR0aGlzLmluZm9XaW5kb3cgPSB0aGlzLmFkZEluZm9XaW5kb3coIGxvY2F0aW9uLmluZm9fd2luZG93ICk7XG5cdFx0dGhpcy5kZWFjdGl2YXRlKCk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMubWFya2VyLCAnY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCggdGhpcyApICk7XG5cdH1cblx0XG5cdC8vIEdlbmVyYXRlcyBhbiAnaW5mbyB3aW5kb3cnIHRoYXQgb3BlbnMgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIHRoZSBtYXJrZXJcblx0YWRkSW5mb1dpbmRvdyggY29udGVudCApIHtcblx0XHRpZiggIWNvbnRlbnQgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcblx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCB0aGlzLnBvc2l0aW9uLmxhdCwgdGhpcy5wb3NpdGlvbi5sbmcgKSxcblx0XHRcdGNvbnRlbnQ6IGNvbnRlbnQsXG5cdFx0XHRwaXhlbE9mZnNldDogbmV3IGdvb2dsZS5tYXBzLlNpemUoIDAsIC0zMCApLFxuXHRcdH0pO1xuXHR9XG5cdFxuXHQvLyBBY3RpdmF0ZXMgdGhlIG1hcmtlclxuXHRhY3RpdmF0ZSgpIHtcblx0XHRpZiggdGhpcy5sb2NhdGlvbi5tYXJrZXJfaW1hZ2VzICYmIHRoaXMubG9jYXRpb24ubWFya2VyX2ltYWdlcy5hY3RpdmUgKSB7XG5cdFx0XHR0aGlzLnJlcGxhY2VJY29uKCB0aGlzLmxvY2F0aW9uLm1hcmtlcl9pbWFnZXMuYWN0aXZlICk7XG5cdFx0fVxuXHRcdGlmKCB0aGlzLmluZm9XaW5kb3cgKSB7XG5cdFx0XHR0aGlzLmluZm9XaW5kb3cub3BlbiggdGhpcy5tYXAubWFwICk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBEZWFjdGl2YXRlcyB0aGUgbWFya2VyXG5cdGRlYWN0aXZhdGUoKSB7XG5cdFx0aWYoIHRoaXMubG9jYXRpb24ubWFya2VyX2ltYWdlcyAmJiB0aGlzLmxvY2F0aW9uLm1hcmtlcl9pbWFnZXMuZGVmYXVsdCApIHtcblx0XHRcdHRoaXMucmVwbGFjZUljb24oIHRoaXMubG9jYXRpb24ubWFya2VyX2ltYWdlcy5kZWZhdWx0ICk7XG5cdFx0fVxuXHRcdGlmKCB0aGlzLmluZm9XaW5kb3cgKSB7XG5cdFx0XHR0aGlzLmluZm9XaW5kb3cuY2xvc2UoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIENyZWF0ZSBhbmQgYXNzaWduIGEgbmV3IG1hcmtlciBpY29uIGZyb20gdGhlIHByb3ZpZGVkIGltYWdlIGRhdGFcblx0cmVwbGFjZUljb24oIGltYWdlRGF0YSApIHtcblx0XHRsZXQgaWNvbkRhdGEgPSB7XG5cdFx0XHR1cmw6IGltYWdlRGF0YS51cmwsXG5cdFx0XHRzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggaW1hZ2VEYXRhLnNpemVbMF0sIGltYWdlRGF0YS5zaXplWzFdICksXG5cdFx0XHRzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggaW1hZ2VEYXRhLnNjYWxlZFNpemVbMF0sIGltYWdlRGF0YS5zY2FsZWRTaXplWzFdICksXG5cdFx0XHRvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCggaW1hZ2VEYXRhLm9yaWdpblswXSwgaW1hZ2VEYXRhLm9yaWdpblsxXSApLFxuXHRcdFx0YW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoIGltYWdlRGF0YS5hbmNob3JbMF0sIGltYWdlRGF0YS5hbmNob3JbMV0gKSxcblx0XHRcdGxhYmVsT3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoIGltYWdlRGF0YS5sYWJlbE9yaWdpblswXSwgaW1hZ2VEYXRhLmxhYmVsT3JpZ2luWzFdICksXG5cdFx0fTtcblx0XHR0aGlzLm1hcmtlci5zZXRJY29uKCBpY29uRGF0YSApO1xuXHRcdGlmKCB0aGlzLmluZm9XaW5kb3cgKSB7XG5cdFx0XHR0aGlzLmluZm9XaW5kb3cuc2V0T3B0aW9ucyh7XG5cdFx0XHRcdHBpeGVsT2Zmc2V0OiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggMCwgKCBpY29uRGF0YS5zY2FsZWRTaXplLmhlaWdodCAqIC0xICkgKSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRGVsZXRlIHNlbGZcblx0ZGVsZXRlKCkge1xuXHRcdHRoaXMuZGVhY3RpdmF0ZSgpO1xuXHRcdHRoaXMubWFya2VyLnNldE1hcCggbnVsbCApO1xuXHR9XG5cdFxuXHQvLyBUcmlnZ2VyIGFjdGlvbnMgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIG1hcmtlclxuXHRvbkNsaWNrKCkge1xuXHRcdHRoaXMubWFwLm1hcmtlcnMuZm9yRWFjaCggbWFya2VyID0+IG1hcmtlci5kZWFjdGl2YXRlKCkgKTtcblx0XHR0aGlzLmFjdGl2YXRlKCk7XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zR2VvbG9jYXRpb24ge1xuXHRcblx0Ly8gUmV0dXJuIGEgcHJldmlvdXNseSBzYXZlZCB1c2VyIGxvY2F0aW9uXG5cdHN0YXRpYyBnZXQgY2FjaGVkTG9jYXRpb24oKSB7XG5cdFx0aWYoIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oICd1c2VyTGF0JyApID09PSBudWxsIHx8IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oICd1c2VyTG5nJyApID09PSBudWxsICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRsYXQ6IHBhcnNlRmxvYXQoIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oICd1c2VyTGF0JyApICksXG5cdFx0XHRsbmc6IHBhcnNlRmxvYXQoIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oICd1c2VyTG5nJyApICksXG5cdFx0fTtcblx0fVxuXHRcblx0Ly8gRGV0ZWN0IHRoZSB1c2VyJ3MgY3VycmVudCBsb2NhdGlvbiBhbmQgY2FjaGUgaXRcblx0c3RhdGljIHJlcXVlc3RMb2NhdGlvbigpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG5cdFx0XHRcdGxvY2F0aW9uID0+IHtcblx0XHRcdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCAndXNlckxhdCcsIGxvY2F0aW9uLmNvb3Jkcy5sYXRpdHVkZSApO1xuXHRcdFx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oICd1c2VyTG5nJywgbG9jYXRpb24uY29vcmRzLmxvbmdpdHVkZSApO1xuXHRcdFx0XHRcdHJlc29sdmUoIHRoaXMuY2FjaGVkTG9jYXRpb24gKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJlamVjdCggRXJyb3IoIGVycm9yLm1lc3NhZ2UgKSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZW5hYmxlSGlnaEFjY3VyYWN5OiBmYWxzZSxcblx0XHRcdFx0XHR0aW1lb3V0OiAxMDAwMCxcblx0XHRcdFx0XHRtYXhpbXVtQWdlOiAwLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9jbGFzcy5sb2NhdGlvbnMtZ2VvbG9jYXRpb24uanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNHZW9jb2RlciB7XG5cdFxuXHQvLyBHZXQgZ2VvY29kZXIgb2JqZWN0IChpbml0aWFsaXplIG9ubHkgb25jZSlcblx0c3RhdGljIGdldCBnZW9jb2RlcigpIHtcblx0XHRkZWxldGUgdGhpcy5nZW9jb2Rlcjtcblx0XHRyZXR1cm4gdGhpcy5nZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xuXHR9XG5cdFxuXHQvLyByZXZlcnNlIGdlb2NvZGluZ1xuXHRzdGF0aWMgcmV2ZXJzZVF1ZXJ5KCBsYXQsIGxuZyApIHtcblx0XHQvLyBsZXQgcXVlcnkgPSB7fVxuXHRcdC8vIHF1ZXJ5LmxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggbGF0LCBsbmcgKTtcblx0XHQvLyBxdWVyeS5wbGFjZUlkID0gc3RyaW5nO1xuXHR9XG5cdFxuXHQvLyBTdWJtaXQgZ2VvY29kaW5nIHF1ZXJ5XG5cdHN0YXRpYyBxdWVyeSggYWRkcmVzcyApIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFxuXHRcdFx0Ly8gUHJlcGFyZSBxdWVyeVxuXHRcdFx0bGV0IHF1ZXJ5ID0ge307XG5cdFx0XHRxdWVyeS5hZGRyZXNzID0gYWRkcmVzcy50cmltKCk7XG5cdFx0XHQvLyBxdWVyeS5ib3VuZHNcblx0XHRcdHF1ZXJ5LmNvbXBvbmVudFJlc3RyaWN0aW9ucyA9IHtcblx0XHRcdFx0Ly8gcm91dGVcblx0XHRcdFx0Ly8gbG9jYWxpdHlcblx0XHRcdFx0Ly8gYWRtaW5pc3RyYXRpdmVBcmVhXG5cdFx0XHRcdC8vIHBvc3RhbENvZGVcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdC8vIEFwcGx5ICdmb2N1cyBjb3VudHJ5JyBmcm9tIHVzZXIgc2V0dGluZ3Ncblx0XHRcdGlmKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeSAmJiAhbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX3N0cmljdCApIHtcblx0XHRcdFx0cXVlcnkucmVnaW9uID0gbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX2NvdW50cnk7XG5cdFx0XHR9XG5cdFx0XHRpZiggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX2NvdW50cnkgJiYgbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmZvY3VzX3N0cmljdCApIHtcblx0XHRcdFx0cXVlcnkuY29tcG9uZW50UmVzdHJpY3Rpb25zLmNvdW50cnkgPSBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gVmFsaWRhdGUgcXVlcnlcblx0XHRcdGlmKCAhcXVlcnkuYWRkcmVzcyApIHtcblx0XHRcdFx0cmVqZWN0KCBFcnJvciggbG9jc2VhcmNoLmFsZXJ0cy5lbXB0eV9hZGRyZXNzICkgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gU2VuZCBnZW9jb2RlIHJlcXVlc3Rcblx0XHRcdHRoaXMuZ2VvY29kZXIuZ2VvY29kZSggcXVlcnksIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcblx0XHRcdFx0aWYoIHN0YXR1cyAhPSAnT0snICkge1xuXHRcdFx0XHRcdHJlamVjdCggRXJyb3IoIHRoaXMudHJhbnNsYXRlRXJyb3IoIHN0YXR1cyApICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNvbHZlKCByZXN1bHRzICk7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cdFxuXHQvLyBDaGVjayBmb3IgZXJyb3JzIGluIHJlY2VpdmVkIGRhdGFcblx0c3RhdGljIHRyYW5zbGF0ZUVycm9yKCBzdGF0dXMgKSB7XG5cdFx0aWYoIHN0YXR1cyA9PSAnSU5WQUxJRF9SRVFVRVNUJyApIHtcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLmludmFsaWRfcmVxdWVzdDtcblx0XHR9IGVsc2UgaWYoIHN0YXR1cyA9PSAnT1ZFUl9RVUVSWV9MSU1JVCcgKSB7XG5cdFx0XHRyZXR1cm4gbG9jc2VhcmNoLmFsZXJ0cy5xdWVyeV9saW1pdDtcblx0XHR9IGVsc2UgaWYoIHN0YXR1cyA9PSAnWkVST19SRVNVTFRTJyApIHtcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLm5vX3Jlc3VsdHM7XG5cdFx0fSBlbHNlIGlmKCBzdGF0dXMgIT0gJ09LJyApIHtcblx0XHRcdC8vIFVOS05PV05fRVJST1IgYW5kIFJFUVVFU1RfREVOSUVEXG5cdFx0XHRyZXR1cm4gbG9jc2VhcmNoLmFsZXJ0cy51bmtub3duX2Vycm9yO1xuXHRcdH1cblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zRGF0YWJhc2Uge1xuXHRcblx0Ly8gR2V0cyB1c2VmdWwgaW5mbyBmcm9tIGEgZ2VvY29kZSByZXN1bHQgdG8gYmUgdXNlZCBvbiB0aGUgZGIgcXVlcnlcblx0c3RhdGljIGdldEdlb2NvZGVEYXRhKCByZXN1bHQgKSB7XG5cdFx0bGV0IGRiX2ZpZWxkcyA9IHtcblx0XHRcdCdjb3VudHJ5JzogJ2NvdW50cnknLFxuXHRcdFx0J2FkbWluaXN0cmF0aXZlX2FyZWFfbGV2ZWxfMSc6ICdzdGF0ZScsXG5cdFx0XHQncG9zdGFsX2NvZGUnOiAncG9zdGNvZGUnLFxuXHRcdFx0J2xvY2FsaXR5JzogJ2NpdHknLFxuXHRcdH07XG5cdFx0bGV0IHJlc3VsdF90eXBlID0gcmVzdWx0LnR5cGVzLmZpbmQoIHR5cGUgPT4gZGJfZmllbGRzW3R5cGVdICk7XG5cdFx0aWYoIHJlc3VsdF90eXBlICkge1xuXHRcdFx0bGV0IHJlc3VsdF9kYXRhID0gcmVzdWx0LmFkZHJlc3NfY29tcG9uZW50cy5maW5kKCBjb21wb25lbnQgPT4gY29tcG9uZW50LnR5cGVzLmluY2x1ZGVzKCByZXN1bHRfdHlwZSApICk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2RlOiByZXN1bHRfZGF0YS5zaG9ydF9uYW1lLFxuXHRcdFx0XHRuYW1lOiByZXN1bHRfZGF0YS5sb25nX25hbWUsXG5cdFx0XHRcdGZpZWxkOiBkYl9maWVsZHNbcmVzdWx0X3R5cGVdLFxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRcblx0Ly8gU3VibWl0IGEgZGF0YWJhc2UgcXVlcnlcblx0c3RhdGljIHF1ZXJ5KCBsYXQsIGxuZywgcmFkaXVzICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XG5cdFx0XHQvLyBQcmVwYXJlIHF1ZXJ5XG5cdFx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHRcdCdhY3Rpb24nOiAnbG9jYXRpb25zX3NlYXJjaCcsXG5cdFx0XHRcdGxhdCxcblx0XHRcdFx0bG5nLFxuXHRcdFx0XHRzZWFyY2hfcmFkaXVzOiByYWRpdXMsXG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRpZiggdHlwZW9mIGZldGNoID09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdC8vIElmIGZldGNoIGlzIGF2YWlsYWJsZSwgdXNlIGl0XG5cdFx0XHRcdGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuXHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0Zm9yKCBsZXQga2V5IGluIHF1ZXJ5ICkge1xuXHRcdFx0XHRcdGlmKCBxdWVyeS5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoIGtleSwgcXVlcnlba2V5XSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmZXRjaCggbG9jc2VhcmNoLmFqYXhfdXJsLCB7bWV0aG9kOiAnUE9TVCcsIGhlYWRlcnMsIGJvZHk6IGZvcm1EYXRhfSApXG5cdFx0XHRcdFx0LnRoZW4oIHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0XHRpZiggIXJlc3VsdC5vayApIHJlamVjdCggRXJyb3IoIHJlc3VsdC5zdGF0dXNUZXh0ICkgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQuanNvbigpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oIHJlc29sdmUgKS5jYXRjaCggcmVqZWN0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBPdGhlcndpc2UgZmFsbGJhY2sgdG8galF1ZXJ5XG5cdFx0XHRcdGpRdWVyeS5wb3N0KHtcblx0XHRcdFx0XHR1cmw6ICAgICAgbG9jc2VhcmNoLmFqYXhfdXJsLFxuXHRcdFx0XHRcdGRhdGE6ICAgICBxdWVyeSxcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbigganFYSFIsIHN0YXR1cywgZXJyb3IgKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoIEVycm9yKCBgRXJyb3I6ICR7ZXJyb3J9YCApICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggbG9jYXRpb25zLCBzdGF0dXMsIGpxWEhSICkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSggbG9jYXRpb25zICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZWRpdC1zZXR0aW5ncy5zY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZnJvbnRlbmQuc2Nzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9