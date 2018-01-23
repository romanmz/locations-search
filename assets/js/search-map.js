jQuery(document).ready(function($){
	
	
	// ==================================================
	// FUNCTIONS
	// ==================================================
	
	// MAPS
	// ------------------------------
	
	// Create map with default settings
	function createMap( htmlContainer ) {
		var map = new google.maps.Map( htmlContainer, {
			styles: locsearch.map_attributes.styles,
		});
		map.setCenter({
			lat: locsearch.map_attributes.initial_lat,
			lng: locsearch.map_attributes.initial_lng,
		});
		map.setZoom( locsearch.map_attributes.max_zoom );
		return map;
	}
	
	// Enforce max zoom level
	function checkZoomLevel( map ) {
		if( map.getZoom() > locsearch.map_attributes.max_zoom ) {
			map.setZoom( locsearch.map_attributes.max_zoom );
		}
	}
	
	// MARKERS
	// ------------------------------
	
	// Add markers to a map from a list of locations
	function addMarkers( map, locations ) {
		var markers = [];
		var newBounds = new google.maps.LatLngBounds();
		$.each( locations, function( i, location ){
			markers.push( addMarker( map, location.lat, location.lng, location.title ) );
			newBounds.extend( location );
		});
		if( markers.length ) {
			map.fitBounds( newBounds );
		}
		checkZoomLevel( map );
		return markers;
	}
	
	// Add a marker to a map
	function addMarker( map, lat, lng, label ) {
		return new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng( lat, lng ),
			label: label,
		});
	}
	
	// Delete markers
	function removeMarkers( map, markers ) {
		$.each( markers, function( i, marker ) {
			marker.setMap( null );
		});
	}
	
	// GEOCODING
	// ------------------------------
	
	// Submit geocoding query
	function geocodeQuery( caller, address ) {
		
		// Check lock
		if( caller.data( 'isLocked' ) ) {
			return;
		}
		
		// Prepare query
		var query = {};
		query.address = $.trim( address );
		query.componentRestrictions = {};
		
		// Validate query
		if( !query.address ) {
			alert( locsearch.alerts.empty_address );
			return;
		}
		
		// Send geocode request
		caller.trigger( 'locsearch_geocode_lock' );
		geocoder.geocode( query, function( results, status ){
			caller.trigger( 'locsearch_geocode_unlock' );
			geocodeReadErrors( results, status );
			if( status == 'OK' ) {
				caller.trigger( 'locsearch_geocode_results', [results] );
				if( !results.length ) {
					caller.trigger( 'locsearch_geocode_0_results' );
				} else if( results.length == 1 ) {
					caller.trigger( 'locsearch_geocode_1_result', results );
				} else {
					caller.trigger( 'locsearch_geocode_many_results', [results] );
				}
			}
		});
	}
	
	// Check for errors in received data
	function geocodeReadErrors( results, status ) {
		if( status == 'INVALID_REQUEST' ) {
			alert( locsearch.alerts.invalid_request );
		}
		if( status == 'OVER_QUERY_LIMIT' ) {
			alert( locsearch.alerts.query_limit );
		}
		if( status == 'ZERO_RESULTS' || ( status == 'OK' && !results.length ) ) {
			alert( locsearch.alerts.no_results );
		}
		if( status != 'OK' ) {
			// UNKNOWN_ERROR and REQUEST_DENIED
			alert( locsearch.alerts.unknown_error );
		}
	}
	
	// DATABASE QUERIES
	// ------------------------------
	
	// Prepare a geocode result and submit a database query
	function databaseQueryFromGeocode( caller, result ) {
		var lat = result.geometry.location.lat();
		var lng = result.geometry.location.lng();
		databaseQuery( caller, lat, lng );
	}
	
	// Submit a database query
	function databaseQuery( caller, lat, lng ) {
		
		// Check lock
		if( caller.data( 'isLocked' ) ) {
			return;
		}
		
		// Prepare query
		var query = {};
		query.action = 'locations_map_search';
		query.lat = lat;
		query.lng = lng;
		
		// Send query
		caller.trigger( 'locsearch_database_lock' );
		$.post({
			url:      locsearch.ajax_url,
			data:     query,
			dataType: 'json',
			error: function( jqXHR, status, error ) {
				alert( error ? 'Error: '+error : locsearch.alerts.unknown_error );
			},
			success: function( locations, status, jqXHR ) {
				caller.trigger( 'locsearch_database_results', [locations] );
			},
			complete: function( jqXHR, status ) {
				// status: success notmodified nocontent error timeout abort parsererror
				caller.trigger( 'locsearch_database_unlock' );
			}
		});
	}
	
	
	// ==================================================
	// SHORTCODES
	// ==================================================
	
	// Check Google Maps API
	if( typeof google !== 'object' ) {
		alert( locsearch.alerts.api_unavailable );
	}
	var geocoder = null;
	
	// Generate locations maps
	$('.locsearch_map').each(function(){
		var map = createMap( this );
		var markers = addMarkers( map, $(this).data('locations') );
	});
	
	// Initialize search boxes
	$('.locsearch_box').each(function(){
		
		// Init objects
		var box = $(this);
		var mapContainer = box.find('.locsearch_box__map');
		var searchForm = box.find('.locsearch_box__form');
		var searchMesages = box.find('.locsearch_box__messages');
		var addressField = searchForm.find( 'input[name=address]' );
		var map = createMap( mapContainer[0] );
		var markers = [];
		if( !geocoder ) {
			geocoder = new google.maps.Geocoder();
		}
		
		// Submit geocoding request
		searchForm.on( 'submit', function(e){
			e.preventDefault();
			geocodeQuery( box, addressField.val() );
		});
		
		// Lock/unlock box
		box.on( 'locsearch_geocode_lock locsearch_database_lock', function(){
			$(this).data( 'isLocked', true );
			$(this).addClass( 'locsearch_box--loading' );
			$(this).find( ':input' ).prop( 'disabled', true );
		});
		box.on( 'locsearch_geocode_unlock locsearch_database_unlock', function(){
			$(this).data( 'isLocked', false );
			$(this).removeClass( 'locsearch_box--loading' );
			$(this).find( ':input' ).prop( 'disabled', false );
		});
		
		// Process geocode results
		box.on( 'locsearch_geocode_1_result', function( e, result ){
			databaseQueryFromGeocode( box, result );
		});
		box.on( 'locsearch_geocode_many_results', function( e, results ){
			var list = $('<ul>');
			$.each( results, function( i, result ){
				var item = $('<li>');
				var link = $('<a>',{ href: '#', text: result.formatted_address });
				link.on( 'click', function(e){
					e.preventDefault();
					databaseQueryFromGeocode( box, result );
				});
				list.append( item.append( link ) );
			});
			searchMesages.html( '<div>'+locsearch.text.did_you_mean+'</div>' );
			searchMesages.append( list );
		// Process database query results
		box.on( 'locsearch_database_results', function( e, locations ){
			
			// Display number of results
			if( !locations.length ) {
				searchMesages.html( '<p>'+locsearch.text['0_results']+'</p>' );
			} else if( locations.length == 1 ) {
				searchMesages.html( '<p>'+locsearch.text['1_result']+'</p>' );
			} else {
				searchMesages.html( '<p>'+locsearch.text.many_results.replace( '%s', locations.length ) +'</p>' );
			}
			
			// Add markers
			removeMarkers( map, markers );
			markers = addMarkers( map, locations );
		});
		});
		
	});
});
