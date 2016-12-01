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
		if( !locations.length ) {
			return;
		}
		
		// Create list
		var list = $('<ul>');
		$.each( locations, function( i, location ) {
			var item = $('<li>').append( location.results_html );
			list.append( item );
		});
		
		// Update results
		searchResults.append( list );
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
	
	
	// Bind events
	// ------------------------------
	searchForm.on( 'submit', function(e){
		e.preventDefault();
		geocodeSubmitQuery();
	});
	
	
});
