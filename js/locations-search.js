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
		formUnlock();
		searchOptions.empty();
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
				locationsGetByGeocode( geocodeResult );
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
		formUnlock();
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
	
	
});
