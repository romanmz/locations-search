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
			this.map.checkZoomLevel();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTA5ZTU4NGFlNDg4M2U4OTFjMmUiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9qcy9zaG9ydGNvZGVzLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1tYXAtbWFya2VyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2xvY2F0aW9uLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWdlb2NvZGVyLmpzIiwid2VicGFjazovLy8uL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzP2VjNjciLCJ3ZWJwYWNrOi8vLy4vX3NyYy9zY3NzL2VkaXQtc2V0dGluZ3Muc2Nzcz82NTU0Iiwid2VicGFjazovLy8uL19zcmMvc2Nzcy9zaG9ydGNvZGVzLnNjc3M/NzQ0YSJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsImdvb2dsZSIsImFsZXJ0IiwibG9jc2VhcmNoIiwiYWxlcnRzIiwiYXBpX3VuYXZhaWxhYmxlIiwiZWFjaCIsIm1hcCIsImFkZE1hcmtlcnNGcm9tTG9jYXRpb25zIiwiZGF0YSIsImJveCIsImZvcm0iLCJmaW5kIiwibWVzc2FnZXNCb3giLCJyZXN1bHRzQm94IiwibWFwQm94IiwiYWRkcmVzc0ZpZWxkIiwibG9ja1NlYXJjaCIsImFkZENsYXNzIiwicHJvcCIsInVubG9ja1NlYXJjaCIsInJlbW92ZUNsYXNzIiwidXNlckxvY2F0aW9uRGV0ZWN0ZWQiLCJsYXRMbmciLCJkYXRhYmFzZVJlcXVlc3QiLCJsYXQiLCJsbmciLCJtYXBfYXR0cmlidXRlcyIsInNlYXJjaF9yYWRpdXMiLCJ0ZXh0IiwieW91cl9sb2NhdGlvbiIsInJlcXVlc3RVc2VyTG9jYXRpb24iLCJ2YWwiLCJ0cmltIiwiTG9jYXRpb25zR2VvbG9jYXRpb24iLCJyZXF1ZXN0TG9jYXRpb24iLCJ0aGVuIiwiY2F0Y2giLCJnZW9jb2RlUmVxdWVzdCIsImFkZHJlc3MiLCJMb2NhdGlvbnNHZW9jb2RlciIsInF1ZXJ5IiwiZmluYWxseSIsImdlb2NvZGVSZXNwb25zZSIsImUiLCJtZXNzYWdlIiwicmVzdWx0cyIsImxlbmd0aCIsInNlYXJjaERhdGFiYXNlRnJvbUdlb2NvZGUiLCJzaG93R2VvY29kZUFsdGVybmF0aXZlcyIsInJlc3VsdCIsImdlb21ldHJ5IiwibG9jYXRpb24iLCJmb3JtYXR0ZWRfYWRkcmVzcyIsImh0bWwiLCJkaWRfeW91X21lYW4iLCJsaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJsaW5rIiwiaHJlZiIsIm9uIiwicHJldmVudERlZmF1bHQiLCJhcHBlbmQiLCJyYWRpdXMiLCJyZWZlcmVuY2VUZXh0IiwibmV3UmFkaXVzIiwic2VhcmNoaW5nX25lYXIiLCJtYXBSYWRpdXMiLCJkcmF3UmFkaXVzIiwib25SYWRpdXNDaGFuZ2UiLCJnZXRDZW50ZXIiLCJnZXRSYWRpdXMiLCJtYXBzIiwiZXZlbnQiLCJhZGRMaXN0ZW5lciIsIkxvY2F0aW9uc0RhdGFiYXNlIiwiZGF0YWJhc2VSZXNwb25zZSIsImxvY2F0aW9ucyIsIm1hbnlfcmVzdWx0cyIsInJlcGxhY2UiLCJlbXB0eSIsImxpc3RfaXRlbSIsImxpc3RJdGVtIiwibWFya2VyIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInBvc2l0aW9uIiwidG9wIiwiY2hpbGRyZW4iLCJ0YXJnZXQiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwidHJpZ2dlciIsImNhY2hlZExvY2F0aW9uIiwiTG9jYXRpb25zTWFwIiwiY29udGFpbmVyIiwiTWFwIiwic3R5bGVzIiwibWFya2VycyIsIk1hcmtlckNsdXN0ZXJlciIsImNsdXN0ZXJzX2ltYWdlIiwibWFya2VyQ2x1c3RlcmVyIiwicmVzZXRNYXBMb2NhdGlvbiIsInNldENlbnRlciIsImluaXRpYWxfbGF0IiwiaW5pdGlhbF9sbmciLCJzZXRab29tIiwibWF4X3pvb20iLCJuZXdCb3VuZHMiLCJzZWFyY2hSYWRpdXMiLCJnZXRCb3VuZHMiLCJMYXRMbmdCb3VuZHMiLCJleHRlbmQiLCJtIiwiZ2V0UG9zaXRpb24iLCJmaXRCb3VuZHMiLCJnZXRab29tIiwicmVtb3ZlQWxsTWFya2VycyIsImFkZE1hcmtlckZyb21Mb2NhdGlvbiIsImJpbmQiLCJjaGVja1pvb21MZXZlbCIsIm5ld01hcmtlciIsImFkZE1hcmtlciIsImRlbGV0ZSIsImNsZWFyTWFya2VycyIsInNldE1hcCIsIkNpcmNsZSIsInN0cm9rZVdlaWdodCIsInN0cm9rZUNvbG9yIiwiZmlsbE9wYWNpdHkiLCJjZW50ZXIiLCJlZGl0YWJsZSIsInJhZGl1c1Jlc2l6ZWQiLCJyYWRpdXNNb3ZlZCIsIm1heF9yYWRpdXMiLCJzZXRSYWRpdXMiLCJMb2NhdGlvbnNNYXBNYXJrZXIiLCJNYXJrZXIiLCJMYXRMbmciLCJsYWJlbCIsIm1hcmtlcl9sYWJlbCIsImluZm9XaW5kb3ciLCJhZGRJbmZvV2luZG93IiwiaW5mb193aW5kb3ciLCJkZWFjdGl2YXRlIiwib25DbGljayIsImNvbnRlbnQiLCJJbmZvV2luZG93IiwicGl4ZWxPZmZzZXQiLCJTaXplIiwiaW1hZ2VzIiwibWFya2VyX2FjdGl2ZSIsInJlcGxhY2VJY29uIiwib3BlbiIsImNsb3NlIiwiaW1hZ2VEYXRhIiwiaWNvbkRhdGEiLCJ1cmwiLCJzaXplIiwic2NhbGVkU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibGFiZWxPcmlnaW4iLCJzZXRJY29uIiwic2V0T3B0aW9ucyIsImhlaWdodCIsImFjdGl2YXRlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInNlc3Npb25TdG9yYWdlIiwic2V0SXRlbSIsImNvb3JkcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiRXJyb3IiLCJlcnJvciIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiZ2V0SXRlbSIsInBhcnNlRmxvYXQiLCJjb21wb25lbnRSZXN0cmljdGlvbnMiLCJmb2N1c19jb3VudHJ5IiwiZm9jdXNfc3RyaWN0IiwicmVnaW9uIiwiY291bnRyeSIsImVtcHR5X2FkZHJlc3MiLCJnZW9jb2RlciIsImdlb2NvZGUiLCJzdGF0dXMiLCJ0cmFuc2xhdGVFcnJvciIsImludmFsaWRfcmVxdWVzdCIsInF1ZXJ5X2xpbWl0Iiwibm9fcmVzdWx0cyIsInVua25vd25fZXJyb3IiLCJHZW9jb2RlciIsImRiX2ZpZWxkcyIsInJlc3VsdF90eXBlIiwidHlwZXMiLCJ0eXBlIiwicmVzdWx0X2RhdGEiLCJhZGRyZXNzX2NvbXBvbmVudHMiLCJjb21wb25lbnQiLCJpbmNsdWRlcyIsImNvZGUiLCJzaG9ydF9uYW1lIiwibmFtZSIsImxvbmdfbmFtZSIsImZpZWxkIiwiZmV0Y2giLCJoZWFkZXJzIiwiSGVhZGVycyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImFqYXhfdXJsIiwibWV0aG9kIiwiYm9keSIsIm9rIiwic3RhdHVzVGV4dCIsImpzb24iLCJwb3N0IiwiZGF0YVR5cGUiLCJqcVhIUiIsInN1Y2Nlc3MiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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WHJOLFlBQVVnQyxLQUZDO0FBR1g0TCxnQkFBVSxNQUhDO0FBSVhoRCxhQUFPLGVBQVVpRCxLQUFWLEVBQWlCbkMsTUFBakIsRUFBeUJkLE1BQXpCLEVBQWlDO0FBQ3ZDVixjQUFRUyxrQkFBaUJDLE1BQWpCLENBQVI7QUFDQSxPQU5VO0FBT1hrRCxlQUFTLGlCQUFVekosU0FBVixFQUFxQnFILE1BQXJCLEVBQTZCbUMsS0FBN0IsRUFBcUM7QUFDN0M1RCxlQUFTNUYsU0FBVDtBQUNBO0FBVFUsTUFBWjtBQVdBO0FBRUQsSUF4Q00sQ0FBUDtBQXlDQTs7Ozs7O3lEQWpFbUJGLGlCOzs7Ozs7QUNBckIseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSx5QyIsImZpbGUiOiIvYXNzZXRzL2pzL3Nob3J0Y29kZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMDllNTg0YWU0ODgzZTg5MWMyZSIsImltcG9ydCBMb2NhdGlvbnNNYXAgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtbWFwLmpzJztcbmltcG9ydCBMb2NhdGlvbnNHZW9sb2NhdGlvbiBmcm9tICcuL2NsYXNzLmxvY2F0aW9ucy1nZW9sb2NhdGlvbi5qcyc7XG5pbXBvcnQgTG9jYXRpb25zR2VvY29kZXIgZnJvbSAnLi9jbGFzcy5sb2NhdGlvbnMtZ2VvY29kZXIuanMnO1xuaW1wb3J0IExvY2F0aW9uc0RhdGFiYXNlIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzJztcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oJCl7XG5cdFxuXHQvLyBDaGVjayBHb29nbGUgTWFwcyBBUElcblx0aWYoIHR5cGVvZiBnb29nbGUgIT09ICdvYmplY3QnICkge1xuXHRcdGFsZXJ0KCBsb2NzZWFyY2guYWxlcnRzLmFwaV91bmF2YWlsYWJsZSApO1xuXHRcdHJldHVybjtcblx0fVxuXHRcblx0Ly8gR2VuZXJhdGUgbG9jYXRpb25zIG1hcHNcblx0JCgnLmxvY3NlYXJjaF9tYXAnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0bGV0IG1hcCA9IG5ldyBMb2NhdGlvbnNNYXAoIHRoaXMgKTtcblx0XHRtYXAuYWRkTWFya2Vyc0Zyb21Mb2NhdGlvbnMoICQodGhpcykuZGF0YSgnbG9jYXRpb25zJykgKTtcblx0fSk7XG5cdFxuXHQvLyBJbml0aWFsaXplIHNlYXJjaCBib3hlc1xuXHQkKCcubG9jc2VhcmNoX2JveCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcblx0XHRcblx0XHQvLyBJbml0IG9iamVjdHNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRsZXQgYm94ID0gJCh0aGlzKTtcblx0XHRsZXQgZm9ybSA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fZm9ybScpO1xuXHRcdGxldCBtZXNzYWdlc0JveCA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fbWVzc2FnZXMnKTtcblx0XHRsZXQgcmVzdWx0c0JveCA9IGJveC5maW5kKCcubG9jc2VhcmNoX2JveF9fcmVzdWx0cycpO1xuXHRcdGxldCBtYXBCb3ggPSBib3guZmluZCgnLmxvY3NlYXJjaF9ib3hfX21hcCcpO1xuXHRcdGxldCBhZGRyZXNzRmllbGQgPSBmb3JtLmZpbmQoICdpbnB1dFtuYW1lPWFkZHJlc3NdJyApO1xuXHRcdGxldCBtYXAgPSBuZXcgTG9jYXRpb25zTWFwKCBtYXBCb3hbMF0gKTtcblx0XHRcblx0XHRcblx0XHQvLyBJbml0IGZ1bmN0aW9uc1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdC8vIExvY2svdW5sb2NrIHNlYXJjaCBib3hcblx0XHRmdW5jdGlvbiBsb2NrU2VhcmNoKCkge1xuXHRcdFx0Ym94LmRhdGEoICdpc0xvY2tlZCcsIHRydWUgKTtcblx0XHRcdGJveC5hZGRDbGFzcyggJ2xvY3NlYXJjaF9ib3gtLWxvYWRpbmcnICk7XG5cdFx0XHRib3guZmluZCggJzppbnB1dCcgKS5wcm9wKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVubG9ja1NlYXJjaCgpIHtcblx0XHRcdGJveC5kYXRhKCAnaXNMb2NrZWQnLCBmYWxzZSApO1xuXHRcdFx0Ym94LnJlbW92ZUNsYXNzKCAnbG9jc2VhcmNoX2JveC0tbG9hZGluZycgKTtcblx0XHRcdGJveC5maW5kKCAnOmlucHV0JyApLnByb3AoICdkaXNhYmxlZCcsIGZhbHNlICk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFNlYXJjaCBkYXRhYmFzZSBiYXNlZCBvbiB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYXRpb25cblx0XHRmdW5jdGlvbiB1c2VyTG9jYXRpb25EZXRlY3RlZCggbGF0TG5nICkge1xuXHRcdFx0ZGF0YWJhc2VSZXF1ZXN0KCBsYXRMbmcubGF0LCBsYXRMbmcubG5nLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc2VhcmNoX3JhZGl1cywgbG9jc2VhcmNoLnRleHQueW91cl9sb2NhdGlvbiApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXF1ZXN0VXNlckxvY2F0aW9uKCkge1xuXHRcdFx0aWYoIGFkZHJlc3NGaWVsZC52YWwoKS50cmltKCkgPT0gJycgKSB7XG5cdFx0XHRcdExvY2F0aW9uc0dlb2xvY2F0aW9uLnJlcXVlc3RMb2NhdGlvbigpXG5cdFx0XHRcdFx0LnRoZW4oIHVzZXJMb2NhdGlvbkRldGVjdGVkIClcblx0XHRcdFx0XHQuY2F0Y2goIGU9Pnt9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8vIFVzZSBnZW9jb2RpbmcgdG8gY29udmVydCBhZGRyZXNzZXMgaW50byBjb29yZGluYXRlc1xuXHRcdGZ1bmN0aW9uIGdlb2NvZGVSZXF1ZXN0KCBhZGRyZXNzICkge1xuXHRcdFx0aWYoIGJveC5kYXRhKCAnaXNMb2NrZWQnICkgKSByZXR1cm47XG5cdFx0XHRsb2NrU2VhcmNoKCk7XG5cdFx0XHRMb2NhdGlvbnNHZW9jb2Rlci5xdWVyeSggYWRkcmVzcyApXG5cdFx0XHRcdC5maW5hbGx5KCB1bmxvY2tTZWFyY2ggKVxuXHRcdFx0XHQudGhlbiggZ2VvY29kZVJlc3BvbnNlIClcblx0XHRcdFx0LmNhdGNoKCBlID0+IGFsZXJ0KCBgRXJyb3I6ICR7ZS5tZXNzYWdlfWAgKSApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZW9jb2RlUmVzcG9uc2UoIHJlc3VsdHMgKSB7XG5cdFx0XHRpZiggcmVzdWx0cy5sZW5ndGggPT09IDEgKSB7XG5cdFx0XHRcdHNlYXJjaERhdGFiYXNlRnJvbUdlb2NvZGUoIHJlc3VsdHNbMF0gKTtcblx0XHRcdH0gZWxzZSBpZiggcmVzdWx0cy5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRzaG93R2VvY29kZUFsdGVybmF0aXZlcyggcmVzdWx0cyApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWFyY2hEYXRhYmFzZUZyb21HZW9jb2RlKCByZXN1bHQgKSB7XG5cdFx0XHRkYXRhYmFzZVJlcXVlc3QoIHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKSwgcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc2VhcmNoX3JhZGl1cywgcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dHZW9jb2RlQWx0ZXJuYXRpdmVzKCByZXN1bHRzICkge1xuXHRcdFx0bWVzc2FnZXNCb3guaHRtbCggJzxwPicrbG9jc2VhcmNoLnRleHQuZGlkX3lvdV9tZWFuKyc8L3A+JyApO1xuXHRcdFx0bGV0IGxpc3QgPSAkKCc8dWw+Jyk7XG5cdFx0XHRyZXN1bHRzLmZvckVhY2goIHJlc3VsdCA9PiB7XG5cdFx0XHRcdGxldCBpdGVtID0gJCgnPGxpPicpO1xuXHRcdFx0XHRsZXQgbGluayA9ICQoJzxhPicseyBocmVmOiAnIycsIHRleHQ6IHJlc3VsdC5mb3JtYXR0ZWRfYWRkcmVzcyB9KTtcblx0XHRcdFx0bGluay5vbiggJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2VhcmNoRGF0YWJhc2VGcm9tR2VvY29kZSggcmVzdWx0ICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsaXN0LmFwcGVuZCggaXRlbS5hcHBlbmQoIGxpbmsgKSApO1xuXHRcdFx0fSk7XG5cdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoIGxpc3QgKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gRGF0YWJhc2UgcmVzdWx0c1xuXHRcdGZ1bmN0aW9uIGRhdGFiYXNlUmVxdWVzdCggbGF0LCBsbmcsIHJhZGl1cywgcmVmZXJlbmNlVGV4dCwgbmV3UmFkaXVzPXRydWUgKSB7XG5cdFx0XHRpZiggYm94LmRhdGEoICdpc0xvY2tlZCcgKSApIHJldHVybjtcblx0XHRcdGxvY2tTZWFyY2goKTtcblx0XHRcdG1lc3NhZ2VzQm94Lmh0bWwoIHJlZmVyZW5jZVRleHQgPyBgPHA+JHtsb2NzZWFyY2gudGV4dC5zZWFyY2hpbmdfbmVhcn0gJHtyZWZlcmVuY2VUZXh0fTwvcD5gIDogJycgKTtcblx0XHRcdFxuXHRcdFx0Ly8gRHJhdyBhIG5ldyByYWRpdXMgYXJlYSwgYW5kIHJlLXN1Ym1pdCBkYXRhYmFzZSBxdWVyeSBpZiB0aGUgdXNlciByZXNpemVzIG9yIG1vdmVzIHRoZSByYWRpdXNcblx0XHRcdGlmKCBuZXdSYWRpdXMgKSB7XG5cdFx0XHRcdGxldCBtYXBSYWRpdXMgPSBtYXAuZHJhd1JhZGl1cyggbGF0LCBsbmcsIHJhZGl1cyApO1xuXHRcdFx0XHRsZXQgb25SYWRpdXNDaGFuZ2UgPSAoKT0+e1xuXHRcdFx0XHRcdGRhdGFiYXNlUmVxdWVzdCggbWFwUmFkaXVzLmdldENlbnRlcigpLmxhdCgpLCBtYXBSYWRpdXMuZ2V0Q2VudGVyKCkubG5nKCksIG1hcFJhZGl1cy5nZXRSYWRpdXMoKS8xMDAwLCAnJywgZmFsc2UgKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIG1hcFJhZGl1cywgJ3JhZGl1c19jaGFuZ2VkJywgb25SYWRpdXNDaGFuZ2UgKTtcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIG1hcFJhZGl1cywgJ2NlbnRlcl9jaGFuZ2VkJywgb25SYWRpdXNDaGFuZ2UgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gU3VibWl0IGRhdGFiYXNlIHF1ZXJ5XG5cdFx0XHRMb2NhdGlvbnNEYXRhYmFzZS5xdWVyeSggbGF0LCBsbmcsIHJhZGl1cyApXG5cdFx0XHRcdC5maW5hbGx5KCB1bmxvY2tTZWFyY2ggKVxuXHRcdFx0XHQudGhlbiggZGF0YWJhc2VSZXNwb25zZSApXG5cdFx0XHRcdC5jYXRjaCggZSA9PiBhbGVydCggYEVycm9yOiAke2UubWVzc2FnZX1gICkgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZGF0YWJhc2VSZXNwb25zZSggbG9jYXRpb25zICkge1xuXHRcdFx0aWYoICFsb2NhdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoICc8cD4nK2xvY3NlYXJjaC50ZXh0WycwX3Jlc3VsdHMnXSsnPC9wPicgKTtcblx0XHRcdH0gZWxzZSBpZiggbG9jYXRpb25zLmxlbmd0aCA9PSAxICkge1xuXHRcdFx0XHRtZXNzYWdlc0JveC5hcHBlbmQoICc8cD4nK2xvY3NlYXJjaC50ZXh0WycxX3Jlc3VsdCddKyc8L3A+JyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZXNCb3guYXBwZW5kKCAnPHA+Jytsb2NzZWFyY2gudGV4dC5tYW55X3Jlc3VsdHMucmVwbGFjZSggJyVzJywgbG9jYXRpb25zLmxlbmd0aCApICsnPC9wPicgKTtcblx0XHRcdH1cblx0XHRcdG1hcC5hZGRNYXJrZXJzRnJvbUxvY2F0aW9ucyggbG9jYXRpb25zICk7XG5cdFx0XHRcblx0XHRcdC8vIFVwZGF0ZSByZXN1bHRzIGxpc3Rcblx0XHRcdHJlc3VsdHNCb3guZW1wdHkoKTtcblx0XHRcdGxvY2F0aW9ucy5mb3JFYWNoKCBsb2NhdGlvbiA9PiB7XG5cdFx0XHRcdGlmKCAhbG9jYXRpb24ubGlzdF9pdGVtICkgcmV0dXJuO1xuXHRcdFx0XHRsZXQgbGlzdEl0ZW0gPSAkKGxvY2F0aW9uLmxpc3RfaXRlbSk7XG5cdFx0XHRcdHJlc3VsdHNCb3guYXBwZW5kKCBsaXN0SXRlbSApO1xuXHRcdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggbG9jYXRpb24ubWFya2VyLm1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRcdHJlc3VsdHNCb3guYW5pbWF0ZSh7IHNjcm9sbFRvcDogcmVzdWx0c0JveC5zY3JvbGxUb3AoKSArIGxpc3RJdGVtLnBvc2l0aW9uKCkudG9wIH0pO1xuXHRcdFx0XHRcdHJlc3VsdHNCb3guY2hpbGRyZW4oICcubG9jc2VhcmNoX2JveF9fcmVzdWx0JyApLnJlbW92ZUNsYXNzKCAnbG9jc2VhcmNoX2JveF9fcmVzdWx0LS1zZWxlY3RlZCcgKTtcblx0XHRcdFx0XHRsaXN0SXRlbS5hZGRDbGFzcyggJ2xvY3NlYXJjaF9ib3hfX3Jlc3VsdC0tc2VsZWN0ZWQnICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsaXN0SXRlbS5vbiggJ2NsaWNrJywgZSA9PiB7XG5cdFx0XHRcdFx0aWYoIGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2EnICkgcmV0dXJuO1xuXHRcdFx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoIGxvY2F0aW9uLm1hcmtlci5tYXJrZXIsICdjbGljaycgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0Ly8gSGFuZGxlIHVzZXIgYWN0aW9uc1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdC8vIEZvcm0gc3VibWlzc2lvblxuXHRcdGZvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbihlKXtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGdlb2NvZGVSZXF1ZXN0KCBhZGRyZXNzRmllbGQudmFsKCkgKTtcblx0XHR9KTtcblx0XHRcblx0XHQvLyBUcmlnZ2VyIGF1dG9tYXRpYyBzZWFyY2hlc1xuXHRcdGlmKCBmb3JtLmRhdGEoICdsb2NzZWFyY2gtYXV0b3NlYXJjaCcgKSApIHtcblx0XHRcdGZvcm0udHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHR9IGVsc2UgaWYoIExvY2F0aW9uc0dlb2xvY2F0aW9uLmNhY2hlZExvY2F0aW9uICkge1xuXHRcdFx0dXNlckxvY2F0aW9uRGV0ZWN0ZWQoIExvY2F0aW9uc0dlb2xvY2F0aW9uLmNhY2hlZExvY2F0aW9uICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcXVlc3RVc2VyTG9jYXRpb24oKTtcblx0XHR9XG5cdFx0XG5cdFx0XG5cdH0pO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL3Nob3J0Y29kZXMuanMiLCJpbXBvcnQgTG9jYXRpb25zTWFwTWFya2VyIGZyb20gJy4vY2xhc3MubG9jYXRpb25zLW1hcC1tYXJrZXIuanMnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRpb25zTWFwIHtcblx0XG5cdC8vIENyZWF0ZSBtYXAgYW5kIHNldCBkZWZhdWx0IGF0dHJpYnV0ZXNcblx0Y29uc3RydWN0b3IoIGNvbnRhaW5lciApIHtcblx0XHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblx0XHR0aGlzLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoIGNvbnRhaW5lciwge1xuXHRcdFx0c3R5bGVzOiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuc3R5bGVzLFxuXHRcdH0pO1xuXHRcdHRoaXMubWFya2VycyA9IFtdO1xuXHRcdGlmKCB0eXBlb2YgTWFya2VyQ2x1c3RlcmVyID09PSAnZnVuY3Rpb24nICYmIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5jbHVzdGVyc19pbWFnZSApIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyID0gbmV3IE1hcmtlckNsdXN0ZXJlciggdGhpcy5tYXAsIFtdLCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuY2x1c3RlcnNfaW1hZ2UgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBudWxsO1xuXHRcdH1cblx0XHR0aGlzLnJlc2V0TWFwTG9jYXRpb24oKTtcblx0fVxuXHRcblx0Ly8gU2V0cyB0aGUgbWFwIHRvIHRoZSBkZWZhdWx0IGxvY2F0aW9uXG5cdHJlc2V0TWFwTG9jYXRpb24oKSB7XG5cdFx0dGhpcy5tYXAuc2V0Q2VudGVyKHtcblx0XHRcdGxhdDogbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLmluaXRpYWxfbGF0LFxuXHRcdFx0bG5nOiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuaW5pdGlhbF9sbmcsXG5cdFx0fSk7XG5cdFx0dGhpcy5tYXAuc2V0Wm9vbSggbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF96b29tICk7XG5cdH1cblx0XG5cdC8vIEVuZm9yY2UgbWF4IHpvb20gbGV2ZWxcblx0Y2hlY2tab29tTGV2ZWwoKSB7XG5cdFx0bGV0IG5ld0JvdW5kcyA9IHRoaXMuc2VhcmNoUmFkaXVzID8gdGhpcy5zZWFyY2hSYWRpdXMuZ2V0Qm91bmRzKCkgOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG5cdFx0dGhpcy5tYXJrZXJzLmZvckVhY2goIG0gPT4geyBuZXdCb3VuZHMuZXh0ZW5kKCBtLm1hcmtlci5nZXRQb3NpdGlvbigpICkgfSApO1xuXHRcdHRoaXMubWFwLmZpdEJvdW5kcyggbmV3Qm91bmRzICk7XG5cdFx0aWYoIHRoaXMubWFwLmdldFpvb20oKSA+IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfem9vbSApIHtcblx0XHRcdHRoaXMubWFwLnNldFpvb20oIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5tYXhfem9vbSApO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gQ3JlYXRlIGFuZCBhZGQgbWFya2VycyBmcm9tIGEgbGlzdCBvZiBsb2NhdGlvbnMgKGRlbGV0ZXMgYWxsIHByZXZpb3VzIG1hcmtlcnMpXG5cdGFkZE1hcmtlcnNGcm9tTG9jYXRpb25zKCBsb2NhdGlvbnMgKSB7XG5cdFx0dGhpcy5yZW1vdmVBbGxNYXJrZXJzKCk7XG5cdFx0dGhpcy5tYXJrZXJzID0gbG9jYXRpb25zLm1hcCggdGhpcy5hZGRNYXJrZXJGcm9tTG9jYXRpb24uYmluZCggdGhpcyApICk7XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHR9XG5cdGFkZE1hcmtlckZyb21Mb2NhdGlvbiggbG9jYXRpb24gKSB7XG5cdFx0bGV0IG5ld01hcmtlciA9IG5ldyBMb2NhdGlvbnNNYXBNYXJrZXIoIHRoaXMsIGxvY2F0aW9uICk7XG5cdFx0aWYoIHRoaXMubWFya2VyQ2x1c3RlcmVyICkge1xuXHRcdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2VyKCBuZXdNYXJrZXIubWFya2VyICk7XG5cdFx0fVxuXHRcdGxvY2F0aW9uLm1hcmtlciA9IG5ld01hcmtlcjtcblx0XHRyZXR1cm4gbmV3TWFya2VyO1xuXHR9XG5cdFxuXHQvLyBEZWxldGUgYWxsIGV4aXN0aW5nIG1hcmtlcnNcblx0cmVtb3ZlQWxsTWFya2VycygpIHtcblx0XHR0aGlzLm1hcmtlcnMuZm9yRWFjaCggbWFya2VyID0+IG1hcmtlci5kZWxldGUoKSApO1xuXHRcdHRoaXMubWFya2VycyA9IFtdO1xuXHRcdGlmKCB0aGlzLm1hcmtlckNsdXN0ZXJlciApIHtcblx0XHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyLmNsZWFyTWFya2VycygpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRHJhdyBzZWFyY2ggcmFkaXVzIG9uIHRoZSBtYXBcblx0ZHJhd1JhZGl1cyggbGF0LCBsbmcsIHJhZGl1cyApIHtcblx0XHRpZiggdGhpcy5zZWFyY2hSYWRpdXMgKSB7XG5cdFx0XHR0aGlzLnNlYXJjaFJhZGl1cy5zZXRNYXAoIG51bGwgKTtcblx0XHR9XG5cdFx0dGhpcy5zZWFyY2hSYWRpdXMgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcblx0XHRcdHN0cm9rZVdlaWdodDogMSxcblx0XHRcdHN0cm9rZUNvbG9yOiAnI0ZGMDAwMCcsXG5cdFx0XHRmaWxsT3BhY2l0eTogMCxcblx0XHRcdG1hcDogdGhpcy5tYXAsXG5cdFx0XHRjZW50ZXI6IHtsYXQsIGxuZ30sXG5cdFx0XHRyYWRpdXM6IHJhZGl1cyAqIDEwMDAsXG5cdFx0XHRlZGl0YWJsZTogdHJ1ZSxcblx0XHR9KTtcblx0XHR0aGlzLmNoZWNrWm9vbUxldmVsKCk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMuc2VhcmNoUmFkaXVzLCAncmFkaXVzX2NoYW5nZWQnLCB0aGlzLnJhZGl1c1Jlc2l6ZWQuYmluZCggdGhpcyApICk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMuc2VhcmNoUmFkaXVzLCAnY2VudGVyX2NoYW5nZWQnLCB0aGlzLnJhZGl1c01vdmVkLmJpbmQoIHRoaXMgKSApO1xuXHRcdHJldHVybiB0aGlzLnNlYXJjaFJhZGl1cztcblx0fVxuXHRcblx0Ly8gQ2FsbGJhY2tzIGFmdGVyIHJlc2l6aW5nIG9yIG1vdmluZyBhcm91bmQgdGhlIHNlYXJjaCBhcmVhXG5cdHJhZGl1c1Jlc2l6ZWQoKSB7XG5cdFx0aWYoIHRoaXMuc2VhcmNoUmFkaXVzLmdldFJhZGl1cygpID4gbG9jc2VhcmNoLm1hcF9hdHRyaWJ1dGVzLm1heF9yYWRpdXMgKiAxMDAwICkge1xuXHRcdFx0dGhpcy5zZWFyY2hSYWRpdXMuc2V0UmFkaXVzKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMubWF4X3JhZGl1cyAqIDEwMDAgKTtcblx0XHR9XG5cdFx0dGhpcy5jaGVja1pvb21MZXZlbCgpO1xuXHR9XG5cdHJhZGl1c01vdmVkKCkge1xuXHRcdHRoaXMuY2hlY2tab29tTGV2ZWwoKTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc01hcE1hcmtlciB7XG5cdFxuXHQvLyBDcmVhdGUgbWFya2VyIGFuZCBhZGQgaXQgdG8gdGhlIHByb3ZpZGVkIG1hcFxuXHRjb25zdHJ1Y3RvciggbWFwLCBsb2NhdGlvbiApIHtcblx0XHR0aGlzLm1hcCA9IG1hcDtcblx0XHR0aGlzLmxvY2F0aW9uID0gbG9jYXRpb247XG5cdFx0dGhpcy5wb3NpdGlvbiA9IHsgbGF0OiBsb2NhdGlvbi5sYXQsIGxuZzogbG9jYXRpb24ubG5nIH07XG5cdFx0dGhpcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdG1hcDogbWFwLm1hcCxcblx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCBsb2NhdGlvbi5sYXQsIGxvY2F0aW9uLmxuZyApLFxuXHRcdFx0bGFiZWw6IGxvY2F0aW9uLm1hcmtlcl9sYWJlbCxcblx0XHR9KTtcblx0XHR0aGlzLmluZm9XaW5kb3cgPSB0aGlzLmFkZEluZm9XaW5kb3coIGxvY2F0aW9uLmluZm9fd2luZG93ICk7XG5cdFx0dGhpcy5kZWFjdGl2YXRlKCk7XG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMubWFya2VyLCAnY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCggdGhpcyApICk7XG5cdH1cblx0XG5cdC8vIEdlbmVyYXRlcyBhbiAnaW5mbyB3aW5kb3cnIHRoYXQgb3BlbnMgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIHRoZSBtYXJrZXJcblx0YWRkSW5mb1dpbmRvdyggY29udGVudCApIHtcblx0XHRpZiggIWNvbnRlbnQgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcblx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCB0aGlzLnBvc2l0aW9uLmxhdCwgdGhpcy5wb3NpdGlvbi5sbmcgKSxcblx0XHRcdGNvbnRlbnQ6IGNvbnRlbnQsXG5cdFx0XHRwaXhlbE9mZnNldDogbmV3IGdvb2dsZS5tYXBzLlNpemUoIDAsIC0zMCApLFxuXHRcdH0pO1xuXHR9XG5cdFxuXHQvLyBBY3RpdmF0ZXMgdGhlIG1hcmtlclxuXHRhY3RpdmF0ZSgpIHtcblx0XHRpZiggdGhpcy5sb2NhdGlvbi5pbWFnZXMubWFya2VyX2FjdGl2ZSApIHtcblx0XHRcdHRoaXMucmVwbGFjZUljb24oIHRoaXMubG9jYXRpb24uaW1hZ2VzLm1hcmtlcl9hY3RpdmUgKTtcblx0XHR9XG5cdFx0aWYoIHRoaXMuaW5mb1dpbmRvdyApIHtcblx0XHRcdHRoaXMuaW5mb1dpbmRvdy5vcGVuKCB0aGlzLm1hcC5tYXAgKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIERlYWN0aXZhdGVzIHRoZSBtYXJrZXJcblx0ZGVhY3RpdmF0ZSgpIHtcblx0XHRpZiggdGhpcy5sb2NhdGlvbi5pbWFnZXMubWFya2VyICkge1xuXHRcdFx0dGhpcy5yZXBsYWNlSWNvbiggdGhpcy5sb2NhdGlvbi5pbWFnZXMubWFya2VyICk7XG5cdFx0fVxuXHRcdGlmKCB0aGlzLmluZm9XaW5kb3cgKSB7XG5cdFx0XHR0aGlzLmluZm9XaW5kb3cuY2xvc2UoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIENyZWF0ZSBhbmQgYXNzaWduIGEgbmV3IG1hcmtlciBpY29uIGZyb20gdGhlIHByb3ZpZGVkIGltYWdlIGRhdGFcblx0cmVwbGFjZUljb24oIGltYWdlRGF0YSApIHtcblx0XHRsZXQgaWNvbkRhdGEgPSB7XG5cdFx0XHR1cmw6IGltYWdlRGF0YS51cmwsXG5cdFx0XHRzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggaW1hZ2VEYXRhLnNpemVbMF0sIGltYWdlRGF0YS5zaXplWzFdICksXG5cdFx0XHRzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggaW1hZ2VEYXRhLnNjYWxlZFNpemVbMF0sIGltYWdlRGF0YS5zY2FsZWRTaXplWzFdICksXG5cdFx0XHRvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCggaW1hZ2VEYXRhLm9yaWdpblswXSwgaW1hZ2VEYXRhLm9yaWdpblsxXSApLFxuXHRcdFx0YW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoIGltYWdlRGF0YS5hbmNob3JbMF0sIGltYWdlRGF0YS5hbmNob3JbMV0gKSxcblx0XHRcdGxhYmVsT3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoIGltYWdlRGF0YS5sYWJlbE9yaWdpblswXSwgaW1hZ2VEYXRhLmxhYmVsT3JpZ2luWzFdICksXG5cdFx0fTtcblx0XHR0aGlzLm1hcmtlci5zZXRJY29uKCBpY29uRGF0YSApO1xuXHRcdGlmKCB0aGlzLmluZm9XaW5kb3cgKSB7XG5cdFx0XHR0aGlzLmluZm9XaW5kb3cuc2V0T3B0aW9ucyh7XG5cdFx0XHRcdHBpeGVsT2Zmc2V0OiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSggMCwgKCBpY29uRGF0YS5zY2FsZWRTaXplLmhlaWdodCAqIC0xICkgKSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gRGVsZXRlIHNlbGZcblx0ZGVsZXRlKCkge1xuXHRcdHRoaXMuZGVhY3RpdmF0ZSgpO1xuXHRcdHRoaXMubWFya2VyLnNldE1hcCggbnVsbCApO1xuXHR9XG5cdFxuXHQvLyBUcmlnZ2VyIGFjdGlvbnMgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIG1hcmtlclxuXHRvbkNsaWNrKCkge1xuXHRcdHRoaXMubWFwLm1hcmtlcnMuZm9yRWFjaCggbWFya2VyID0+IG1hcmtlci5kZWFjdGl2YXRlKCkgKTtcblx0XHR0aGlzLmFjdGl2YXRlKCk7XG5cdFx0dGhpcy5tYXAuY2hlY2tab29tTGV2ZWwoKTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLW1hcC1tYXJrZXIuanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNHZW9sb2NhdGlvbiB7XG5cdFxuXHQvLyBSZXR1cm4gYSBwcmV2aW91c2x5IHNhdmVkIHVzZXIgbG9jYXRpb25cblx0c3RhdGljIGdldCBjYWNoZWRMb2NhdGlvbigpIHtcblx0XHRpZiggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMYXQnICkgPT09IG51bGwgfHwgc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMbmcnICkgPT09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxhdDogcGFyc2VGbG9hdCggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMYXQnICkgKSxcblx0XHRcdGxuZzogcGFyc2VGbG9hdCggc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSggJ3VzZXJMbmcnICkgKSxcblx0XHR9O1xuXHR9XG5cdFxuXHQvLyBEZXRlY3QgdGhlIHVzZXIncyBjdXJyZW50IGxvY2F0aW9uIGFuZCBjYWNoZSBpdFxuXHRzdGF0aWMgcmVxdWVzdExvY2F0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcblx0XHRcdFx0bG9jYXRpb24gPT4ge1xuXHRcdFx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oICd1c2VyTGF0JywgbG9jYXRpb24uY29vcmRzLmxhdGl0dWRlICk7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggJ3VzZXJMbmcnLCBsb2NhdGlvbi5jb29yZHMubG9uZ2l0dWRlICk7XG5cdFx0XHRcdFx0cmVzb2x2ZSggdGhpcy5jYWNoZWRMb2NhdGlvbiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KCBFcnJvciggZXJyb3IubWVzc2FnZSApICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlbmFibGVIaWdoQWNjdXJhY3k6IGZhbHNlLFxuXHRcdFx0XHRcdHRpbWVvdXQ6IDEwMDAwLFxuXHRcdFx0XHRcdG1heGltdW1BZ2U6IDAsXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSk7XG5cdH1cblx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2pzL2NsYXNzLmxvY2F0aW9ucy1nZW9sb2NhdGlvbi5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0aW9uc0dlb2NvZGVyIHtcblx0XG5cdC8vIEdldCBnZW9jb2RlciBvYmplY3QgKGluaXRpYWxpemUgb25seSBvbmNlKVxuXHRzdGF0aWMgZ2V0IGdlb2NvZGVyKCkge1xuXHRcdGRlbGV0ZSB0aGlzLmdlb2NvZGVyO1xuXHRcdHJldHVybiB0aGlzLmdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG5cdH1cblx0XG5cdC8vIHJldmVyc2UgZ2VvY29kaW5nXG5cdHN0YXRpYyByZXZlcnNlUXVlcnkoIGxhdCwgbG5nICkge1xuXHRcdC8vIGxldCBxdWVyeSA9IHt9XG5cdFx0Ly8gcXVlcnkubG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCBsYXQsIGxuZyApO1xuXHRcdC8vIHF1ZXJ5LnBsYWNlSWQgPSBzdHJpbmc7XG5cdH1cblx0XG5cdC8vIFN1Ym1pdCBnZW9jb2RpbmcgcXVlcnlcblx0c3RhdGljIHF1ZXJ5KCBhZGRyZXNzICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XG5cdFx0XHQvLyBQcmVwYXJlIHF1ZXJ5XG5cdFx0XHRsZXQgcXVlcnkgPSB7fTtcblx0XHRcdHF1ZXJ5LmFkZHJlc3MgPSBhZGRyZXNzLnRyaW0oKTtcblx0XHRcdC8vIHF1ZXJ5LmJvdW5kc1xuXHRcdFx0cXVlcnkuY29tcG9uZW50UmVzdHJpY3Rpb25zID0ge1xuXHRcdFx0XHQvLyByb3V0ZVxuXHRcdFx0XHQvLyBsb2NhbGl0eVxuXHRcdFx0XHQvLyBhZG1pbmlzdHJhdGl2ZUFyZWFcblx0XHRcdFx0Ly8gcG9zdGFsQ29kZVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0Ly8gQXBwbHkgJ2ZvY3VzIGNvdW50cnknIGZyb20gdXNlciBzZXR0aW5nc1xuXHRcdFx0aWYoIGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5ICYmICFsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfc3RyaWN0ICkge1xuXHRcdFx0XHRxdWVyeS5yZWdpb24gPSBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeTtcblx0XHRcdH1cblx0XHRcdGlmKCBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfY291bnRyeSAmJiBsb2NzZWFyY2gubWFwX2F0dHJpYnV0ZXMuZm9jdXNfc3RyaWN0ICkge1xuXHRcdFx0XHRxdWVyeS5jb21wb25lbnRSZXN0cmljdGlvbnMuY291bnRyeSA9IGxvY3NlYXJjaC5tYXBfYXR0cmlidXRlcy5mb2N1c19jb3VudHJ5O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBWYWxpZGF0ZSBxdWVyeVxuXHRcdFx0aWYoICFxdWVyeS5hZGRyZXNzICkge1xuXHRcdFx0XHRyZWplY3QoIEVycm9yKCBsb2NzZWFyY2guYWxlcnRzLmVtcHR5X2FkZHJlc3MgKSApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBTZW5kIGdlb2NvZGUgcmVxdWVzdFxuXHRcdFx0dGhpcy5nZW9jb2Rlci5nZW9jb2RlKCBxdWVyeSwgKHJlc3VsdHMsIHN0YXR1cykgPT4ge1xuXHRcdFx0XHRpZiggc3RhdHVzICE9ICdPSycgKSB7XG5cdFx0XHRcdFx0cmVqZWN0KCBFcnJvciggdGhpcy50cmFuc2xhdGVFcnJvciggc3RhdHVzICkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc29sdmUoIHJlc3VsdHMgKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cblx0XG5cdC8vIENoZWNrIGZvciBlcnJvcnMgaW4gcmVjZWl2ZWQgZGF0YVxuXHRzdGF0aWMgdHJhbnNsYXRlRXJyb3IoIHN0YXR1cyApIHtcblx0XHRpZiggc3RhdHVzID09ICdJTlZBTElEX1JFUVVFU1QnICkge1xuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMuaW52YWxpZF9yZXF1ZXN0O1xuXHRcdH0gZWxzZSBpZiggc3RhdHVzID09ICdPVkVSX1FVRVJZX0xJTUlUJyApIHtcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLnF1ZXJ5X2xpbWl0O1xuXHRcdH0gZWxzZSBpZiggc3RhdHVzID09ICdaRVJPX1JFU1VMVFMnICkge1xuXHRcdFx0cmV0dXJuIGxvY3NlYXJjaC5hbGVydHMubm9fcmVzdWx0cztcblx0XHR9IGVsc2UgaWYoIHN0YXR1cyAhPSAnT0snICkge1xuXHRcdFx0Ly8gVU5LTk9XTl9FUlJPUiBhbmQgUkVRVUVTVF9ERU5JRURcblx0XHRcdHJldHVybiBsb2NzZWFyY2guYWxlcnRzLnVua25vd25fZXJyb3I7XG5cdFx0fVxuXHR9XG5cdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9qcy9jbGFzcy5sb2NhdGlvbnMtZ2VvY29kZXIuanMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdGlvbnNEYXRhYmFzZSB7XG5cdFxuXHQvLyBHZXRzIHVzZWZ1bCBpbmZvIGZyb20gYSBnZW9jb2RlIHJlc3VsdCB0byBiZSB1c2VkIG9uIHRoZSBkYiBxdWVyeVxuXHRzdGF0aWMgZ2V0R2VvY29kZURhdGEoIHJlc3VsdCApIHtcblx0XHRsZXQgZGJfZmllbGRzID0ge1xuXHRcdFx0J2NvdW50cnknOiAnY291bnRyeScsXG5cdFx0XHQnYWRtaW5pc3RyYXRpdmVfYXJlYV9sZXZlbF8xJzogJ3N0YXRlJyxcblx0XHRcdCdwb3N0YWxfY29kZSc6ICdwb3N0Y29kZScsXG5cdFx0XHQnbG9jYWxpdHknOiAnY2l0eScsXG5cdFx0fTtcblx0XHRsZXQgcmVzdWx0X3R5cGUgPSByZXN1bHQudHlwZXMuZmluZCggdHlwZSA9PiBkYl9maWVsZHNbdHlwZV0gKTtcblx0XHRpZiggcmVzdWx0X3R5cGUgKSB7XG5cdFx0XHRsZXQgcmVzdWx0X2RhdGEgPSByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoIGNvbXBvbmVudCA9PiBjb21wb25lbnQudHlwZXMuaW5jbHVkZXMoIHJlc3VsdF90eXBlICkgKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvZGU6IHJlc3VsdF9kYXRhLnNob3J0X25hbWUsXG5cdFx0XHRcdG5hbWU6IHJlc3VsdF9kYXRhLmxvbmdfbmFtZSxcblx0XHRcdFx0ZmllbGQ6IGRiX2ZpZWxkc1tyZXN1bHRfdHlwZV0sXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdFxuXHQvLyBTdWJtaXQgYSBkYXRhYmFzZSBxdWVyeVxuXHRzdGF0aWMgcXVlcnkoIGxhdCwgbG5nLCByYWRpdXMgKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcblx0XHRcdC8vIFByZXBhcmUgcXVlcnlcblx0XHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdFx0J2FjdGlvbic6ICdsb2NhdGlvbnNfbWFwX3NlYXJjaCcsXG5cdFx0XHRcdGxhdCxcblx0XHRcdFx0bG5nLFxuXHRcdFx0XHRzZWFyY2hfcmFkaXVzOiByYWRpdXMsXG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRpZiggdHlwZW9mIGZldGNoID09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdC8vIElmIGZldGNoIGlzIGF2YWlsYWJsZSwgdXNlIGl0XG5cdFx0XHRcdGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuXHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdFx0Zm9yKCBsZXQga2V5IGluIHF1ZXJ5ICkge1xuXHRcdFx0XHRcdGlmKCBxdWVyeS5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG5cdFx0XHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoIGtleSwgcXVlcnlba2V5XSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmZXRjaCggbG9jc2VhcmNoLmFqYXhfdXJsLCB7bWV0aG9kOiAnUE9TVCcsIGhlYWRlcnMsIGJvZHk6IGZvcm1EYXRhfSApXG5cdFx0XHRcdFx0LnRoZW4oIHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0XHRpZiggIXJlc3VsdC5vayApIHJlamVjdCggRXJyb3IoIHJlc3VsdC5zdGF0dXNUZXh0ICkgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQuanNvbigpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oIHJlc29sdmUgKS5jYXRjaCggcmVqZWN0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBPdGhlcndpc2UgZmFsbGJhY2sgdG8galF1ZXJ5XG5cdFx0XHRcdGpRdWVyeS5wb3N0KHtcblx0XHRcdFx0XHR1cmw6ICAgICAgbG9jc2VhcmNoLmFqYXhfdXJsLFxuXHRcdFx0XHRcdGRhdGE6ICAgICBxdWVyeSxcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbigganFYSFIsIHN0YXR1cywgZXJyb3IgKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoIEVycm9yKCBgRXJyb3I6ICR7ZXJyb3J9YCApICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggbG9jYXRpb25zLCBzdGF0dXMsIGpxWEhSICkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSggbG9jYXRpb25zICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvanMvY2xhc3MubG9jYXRpb25zLWRhdGFiYXNlLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL19zcmMvc2Nzcy9lZGl0LXNjcmVlbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3MvZWRpdC1zZXR0aW5ncy5zY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL3Njc3Mvc2hvcnRjb2Rlcy5zY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=