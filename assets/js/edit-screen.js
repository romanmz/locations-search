jQuery(document).ready(function($){
	
	
	// Init vars
	// ------------------------------
	
	// Init Google Maps
	var map = new google.maps.Map( document.getElementById( 'locsearch_metabox__map' ), { zoom: 15, } );
	var marker = new google.maps.Marker({ map: map, draggable: true, });
	var geocoder = new google.maps.Geocoder();
	
	// Address fields
	var address = $('#location_address_address');
	var address2 = $('#location_address_address2');
	var city = $('#location_address_city');
	var state = $('#location_address_state');
	var postcode = $('#location_address_postcode');
	var country = $('#location_address_country');
	var lat = $('#location_address_lat');
	var lng = $('#location_address_lng');
	
	// Update buttons
	var updateMapButton = $('#locsearch_metabox__map_update button');
	var alternativeLocations = $('#locsearch_metabox__alternatives');
	
	
	// Init functions
	// ------------------------------
	
	// Update map from exact coordinates
	function updateMap( new_lat, new_lng ) {
		
		// Validate data
		new_lat = parseFloat( new_lat );
		new_lng = parseFloat( new_lng );
		if( isNaN( new_lat ) || isNaN( new_lng ) ) {
			return;
		}
		
		// Update map and marker
		map.setCenter({
			lat: new_lat,
			lng: new_lng,
		});
		marker.setPosition({
			lat: new_lat,
			lng: new_lng,
		});
		map.setZoom( 15 );
		
		// Update form fields
		alternativeLocations.empty();
		lat.val( new_lat );
		lng.val( new_lng );
		
	}
	
	// Update map from geocode object
	function updateMapFromObject( location ) {
		var new_lat = location.geometry.location.lat();
		var new_lng = location.geometry.location.lng();
		updateMap( new_lat, new_lng );
	}
	
	
	// Set initial location
	// ------------------------------
	if( lat.val() && lng.val() ) {
		updateMap( lat.val(), lng.val() );
	} else {
		updateMap( -33.8650, 151.2094 );
	}
	
	
	// Update map after dragging marker
	// ------------------------------
	google.maps.event.addListener( marker, 'dragend', function(){
		var position = marker.getPosition();
		updateMap( position.lat(), position.lng() );
	});
	
	
	// Update map after manually changing the values for latitude or longitude
	// ------------------------------
	lat.add( lng ).on( 'change', function(){
		updateMap( lat.val(), lng.val() );
	});
	
	
	// Update map based on current address
	// ------------------------------
	
	// Function to begin geocoding request
	function beginGeocodeRequest() {
		if( updateMapButton.data( 'isWaiting' ) ) {
			return;
		}
		updateMapButton.data( 'isWaiting', true );
		var geocodeArguments = prepareGeocodeData();
		geocoder.geocode( geocodeArguments, processGeocodeResults );
	}
	
	// Prepare geocode data based on the current address fields
	function prepareGeocodeData() {
		var geocodeArguments = {
			address: $.trim( address.val()+' '+address2.val()+' '+city.val()+' '+state.val()+' '+postcode.val()+' '+country.val() ),
			componentRestrictions: {},
		};
		if( $.trim( state.val() ) ) {
			geocodeArguments.componentRestrictions.administrativeArea = state.val();
		}
		if( $.trim( postcode.val() ) ) {
			geocodeArguments.componentRestrictions.postalCode = postcode.val();
		}
		if( $.trim( country.val() ) ) {
			geocodeArguments.componentRestrictions.country = country.val();
		}
		return geocodeArguments;
	}
	
	// Receive geocode results
	function processGeocodeResults( results, status ) {
		updateMapButton.data( 'isWaiting', false );
		readGeocodeErrors( results, status );
		if( status != 'OK' ) {
			return;
		} else if( results.length === 1 ) {
			updateMapFromObject( results[0] );
		} else if( results.length > 1 ) {
			processMultipleResults( results, status );
		}
	}
	
	// Check for geocoding errors
	function readGeocodeErrors( results, status ) {
		if( status == 'INVALID_REQUEST' ) {
			alert( 'Invalid request, please verify that the requested address is correct' );
		} else if( status == 'OVER_QUERY_LIMIT' ) {
			alert( 'You have exceeded the maximum number of allowed queries, please wait for some time before trying again' );
		} else if( status == 'ZERO_RESULTS' || ( status == 'OK' && !results.length ) ) {
			alert( 'No results found, please try a different address' );
		} else if( status != 'OK' ) {
			// UNKNOWN_ERROR and REQUEST_DENIED
			alert( 'There was an unexpected error, please try again' );
		}
	}
	
	// Process geocoding results
	function processMultipleResults( results, status ) {
		var optionsList = $('<ul>');
		alternativeLocations.empty().append( optionsList );
		$.each( results, function( i, result ){
			var optionItem = $('<li>');
			var optionLink = $('<a>',{ href:'#', text:result.formatted_address });
			optionLink.on( 'click', function(e){
				e.preventDefault();
				updateMapFromObject( result );
			});
			optionsList.append( optionItem.append( optionLink ) );
		});
	}
	
	// Button triggers geocoding request on click
	updateMapButton.on( 'click', function(e){
		e.preventDefault();
		beginGeocodeRequest();
	});
	
});
