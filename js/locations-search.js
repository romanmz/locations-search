jQuery(document).ready(function($){
	
	
	// Init Vars
	// ------------------------------
	
	// Select objects
	var container = $('.lsform__container');
	var searchForm = $('.lsform');
	var searchOptions = $('.lsform__options');
	var searchSummary = $('.lsform__summary');
	var searchResults = $('.lsform__results');
	var map = $('.lsform__map');
	
	// Select fields
	var fieldQuery = $('#lsform__query');
	var fieldDistance = $('#lsform__distance');
	var fieldDistanceUnits = $('#lsform__distanceunits');
	
	// No scripts necessary if there's no search form, or a place to display the results
	if( !searchForm.length || ( !searchResults.length && !map.length ) ) {
		return;
	}
	
	// Init google objects
	var googleGeocoder = new google.maps.Geocoder();
	var googleMap = map.length ? new google.maps.Map( map[0], { zoom:15, } ) : false;
	var mapMarkers = [];
	var mapWindows = [];
	
	
	// Form functions
	// ------------------------------
	var formLock = function() {
		searchForm.data( 'isLocked', true );
		container.addClass( 'lsform--loading' );
	}
	var formUnlock = function() {
		searchForm.data( 'isLocked', false );
		container.removeClass( 'lsform--loading' );
	}
	var formShowOptions = function( geocodeResults ) {
		
		// Unlock form and clean options
		searchOptions.empty();
		searchSummary.empty();
		searchResults.empty();
		mapDeleteLocations();
		if( !geocodeResults.length ) {
			return;
		}
		
		// Create list
		var list = $('<ul>');
		$.each( geocodeResults, function( i, geocodeResult ){
			var item = $('<li>');
			var link = $('<a>',{ href:'#', text:geocodeResult.formatted_address });
			link.on( 'click', function(e){
				e.preventDefault();
				locationsSubmitQueryByGeocode( geocodeResult );
			});
			list.append( item.append( link ) );
		});
		
		// Update options
		searchOptions.html( '<div>'+locations_search.text_did_you_mean+'</div>' );
		searchOptions.append( list );
	}
	var formShowSummary = function( locations ) {
		if( !locations.length ) {
			searchSummary.html( '<p>'+locations_search.text_0_results+'</p>' );
		} else if( locations.length == 1 ) {
			searchSummary.html( '<p>'+locations_search.text_1_result+'</p>' );
		} else {
			searchSummary.html( '<p>'+locations_search.text_more_results.replace( '#', locations.length ) +'</p>' );
		}
	}
	var formShowResults = function( locations ) {
		
		// Unlock form and clean results
		searchOptions.empty();
		formShowSummary( locations );
		searchResults.empty();
		mapReplaceLocations( locations );
		if( !locations.length ) {
			return;
		}
		
		// Create list
		var list = $('<ul>');
		$.each( locations, function( i, location ) {
			var item = $('<li>').append( location.results_html );
			item.on( 'click', function(e){
				if( location.marker && e.target.tagName.toLowerCase() != 'a' ) {
					e.preventDefault();
					mapOpenWindow( location );
				}
			});
			list.append( item );
			location.resultsItem = item;
		});
		
		// Update results
		searchResults.append( list );
	}
	var formScrollToLocation = function( location ) {
		if( location.resultsItem ) {
			searchResults.animate({ scrollTop: searchResults.scrollTop() + location.resultsItem.position().top });
		}
	}
	
	
	// Geocoding functions
	// ------------------------------
	var geocodeSubmitQuery = function() {
		
		// Check lock
		if( searchForm.data( 'isLocked' ) ) {
			return false;
		}
		
		// Prepare geocode query
		var query = {};
		query.address = $.trim( fieldQuery.val() );
		// query.location;
		// query.placeId;
		// query.bounds;
		// query.region;
		// query.componentRestrictions = {};
		// query.componentRestrictions.route;
		// query.componentRestrictions.locality;
		// query.componentRestrictions.administrativeArea;
		// query.componentRestrictions.postalCode;
		// query.componentRestrictions.country;
		
		// Check that query is valid
		if( !query.address ) {
			alert( locations_search.text_please_enter_address );
			return;
		}
		
		// Send geocode request
		formLock();
		googleGeocoder.geocode( query, geocodeHandleResponse );
		
	}
	var geocodeReturnedError = function( results, status ) {
		
		// Return false if no errors found
		if( status == 'OK' && results.length ) {
			return false;
		}
		
		// Alert user and return true
		if( status == 'INVALID_REQUEST' ) {
			alert( locations_search.error_invalid_request );
		}
		if( status == 'OVER_QUERY_LIMIT' ) {
			alert( locations_search.error_query_limit );
		}
		if( status == 'ZERO_RESULTS' || ( status == 'OK' && !results.length ) ) {
			alert( locations_search.error_no_results );
		}
		if( status != 'OK' ) {
			// UNKNOWN_ERROR and REQUEST_DENIED
			alert( locations_search.error_unknown );
		}
		return true;
		
	}
	var geocodeHandleResponse = function( results, status ) {
		formUnlock();
		if( geocodeReturnedError( results, status ) ) {
			//
		} else if( results.length > 1 ) {
			formShowOptions( results );
		} else {
			locationsSubmitQueryByGeocode( results[0] );
		}
	}
	
	
	// Querying Locations
	// ------------------------------
	var locationsSubmitQueryByGeocode = function( geocodeResult ) {
		var lat = geocodeResult.geometry.location.lat();
		var lng = geocodeResult.geometry.location.lng();
		locationsSubmitQuery( lat, lng );
	}
	var locationsSubmitQuery = function( lat, lng ) {
		
		// Check lock
		if( searchForm.data( 'isLocked' ) ) {
			return false;
		}
		
		// Prepare query
		var query = {}
		query.action = locations_search.ajax_action;
		query.lat = lat;
		query.lng = lng;
		query.distance = fieldDistance.val();
		query.distance_units = fieldDistanceUnits.val();
		
		// Submit query
		formLock();
		$.ajax({
			url: locations_search.ajax_url,
			data: query,
			dataType: 'json',
			method: 'POST',
			error: function( jqXHR, status, error ) {
				formUnlock();
				alert( locations_search.error_unknown );
			},
			success: function( locations, status, jqXHR ) {
				formUnlock();
				formShowResults( locations );
			},
		});
	}
	
	
	// Map Functions
	// ------------------------------
	var mapDeleteLocations = function() {
		$.each( mapMarkers, function( i, marker ) {
			marker.setMap( null );
		});
		mapMarkers = [];
		$.each( mapWindows, function( i, infoWindow ) {
			infoWindow.close();
		});
		mapWindows = [];
	}
	var mapAddMarker = function( lat, lng ) {
		
		// Exit if map doesn't exist
		if( !googleMap ) {
			return false;
		}
		
		// Create and add marker
		var position = new google.maps.LatLng( lat, lng );
		var marker = new google.maps.Marker({
			map: googleMap,
			position: position,
		});
		
		// Return marker
		return marker;
	}
	var mapAddWindow = function( lat, lng, content ) {
		var infoWindow = new google.maps.InfoWindow({
			position: new google.maps.LatLng( lat, lng ),
			content: content,
			pixelOffset: new google.maps.Size( 0, -30 ),
		});
		return infoWindow;
	}
	var mapAddLocation = function( location ) {
		
		// Exit if map doesn't exist
		if( !googleMap ) {
			return false;
		}
		
		// Add marker and info window
		var marker = mapAddMarker( location.lat, location.lng );
		var infoWindow = mapAddWindow( location.lat, location.lng, location.info_window );
		location.marker = marker;
		location.infoWindow = infoWindow;
		mapMarkers.push( marker );
		mapWindows.push( infoWindow );
		
		// Show info windows when clicking on the marker
		google.maps.event.addListener( marker, 'click', function(){
			mapOpenWindow( location );
			formScrollToLocation( location );
		});
		
	}
	var mapReplaceLocations = function( locations ) {
		
		// Exit if map doesn't exist
		if( !googleMap ) {
			return false;
		}
		
		// Reset map
		mapDeleteLocations();
		var newBounds = new google.maps.LatLngBounds();
		
		// Add locations
		$.each( locations, function( i, location ){
			mapAddLocation( location );
			newBounds.extend( location );
		});
		googleMap.fitBounds( newBounds );
		
		// Don't zoom in too close
		if( googleMap.getZoom() > 15 ) {
			googleMap.setZoom( 15 );
		}
		
	}
	var mapOpenWindow = function( location ) {
		$.each( mapWindows, function( i, infoW ){
			infoW.close();
		});
		if( location.infoWindow ) {
			location.infoWindow.open( googleMap );
		}
		if( location.resultsItem ) {
			location.resultsItem.addClass( 'lsform__resultselected' )
				.siblings().removeClass( 'lsform__resultselected' );
		}
	}
	
	
	// Bind events
	// ------------------------------
	
	// Set initial map location
	if( googleMap ) {
		googleMap.setCenter({
			lat: parseFloat( locations_search.initial_lat ),
			lng: parseFloat( locations_search.initial_lng ),
		});
		googleMap.setZoom( 15 );
	}
	
	// Search locations on form submit
	searchForm.on( 'submit', function(e){
		e.preventDefault();
		geocodeSubmitQuery();
	});
	
	
	// Automatically begin initial search
	// ------------------------------
	if( searchForm.data( 'lsautosearch' ) ) {
		searchForm.trigger( 'submit' );
	}
	
	
});
