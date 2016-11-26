jQuery(document).ready(function($){
	
	
	// Init vars
	// ------------------------------
	
	// Google Maps objects
	var map = new google.maps.Map( document.getElementById( 'location_address__map' ), { zoom: 15, } );
	var marker = new google.maps.Marker({ map: map, draggable: true, });
	var geocoder = new google.maps.Geocoder();
	
	// Address fields
	var address = $('#location_address_address');
	var suburb = $('#location_address_suburb');
	var state = $('#location_address_state');
	var postcode = $('#location_address_postcode');
	var country = 'Australia';
	var lat = $('#location_address_lat');
	var lng = $('#location_address_lng');
	
	// Update button
	var updateButton = $('#location_address__update');
	var updateOptions = $('#location_address__options');
	
	
	// Init functions
	// ------------------------------
	
	// Update map from exact coordinates
	var updateMap = function( new_lat, new_lng ) {
		
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
		updateOptions.empty();
		lat.val( new_lat );
		lng.val( new_lng );
		
	}
	
	// Update map from geocode object
	var updateMapFromObject = function( location ) {
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
	
	
	// On marker change
	// ------------------------------
	google.maps.event.addListener( marker, 'dragend', function(){
		var position = marker.getPosition();
		updateMap( position.lat(), position.lng() );
	});
	
	
	// On lat, lng change
	// ------------------------------
	lat.add( lng ).on( 'change', function(){
		updateMap( lat.val(), lng.val() );
	});
	
	
	// Manually look up address
	// ------------------------------
	updateButton.on( 'click', function(e){
		e.preventDefault();
		
		// Lock button
		var $this = $(this);
		if( $this.data( 'isWaiting' ) ) {
			return;
		}
		$this.data( 'isWaiting', true );
		
		// Prepare data
		var geocodeArguments = {
			address: $.trim( address.val()+' '+suburb.val()+' '+state.val()+' '+postcode.val()+' '+country ),
			componentRestrictions: {},
		};
		if( state.val() ) {
			geocodeArguments.componentRestrictions.administrativeArea = state.val();
		}
		if( postcode.val() ) {
			geocodeArguments.componentRestrictions.postalCode = postcode.val();
		}
		if( country ) {
			geocodeArguments.componentRestrictions.country = country;
		}
		
		// Prepare callback
		var geocodeCallback = function( results, status ) {
			
			// Unlock button
			$this.data( 'isWaiting', false );
			
			// Check for errors
			if( status == 'INVALID_REQUEST' ) {
				alert( 'Invalid request, please verify that the requested address is correct' );
			}
			else if( status == 'OVER_QUERY_LIMIT' ) {
				alert( 'You have exceeded the maximum number of allowed queries, please wait for some time before trying again' );
			}
			else if( status == 'ZERO_RESULTS' || ( status == 'OK' && !results.length ) ) {
				alert( 'No results found, please try a different address' );
			}
			else if( status != 'OK' ) {
				// UNKNOWN_ERROR and REQUEST_DENIED
				alert( 'There was an unexpected error, please try again' );
			}
			
			// Single result
			if( results.length === 1 ) {
				updateMapFromObject( results[0] );
				return;
			}
			
			// Multiple results
			var optionsList = $('<ul>');
			updateOptions.empty().append( optionsList );
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
		
		// Send request
		geocoder.geocode( geocodeArguments, geocodeCallback );
		
	});
	
	
});
