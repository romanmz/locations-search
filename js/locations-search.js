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
	
	
});
