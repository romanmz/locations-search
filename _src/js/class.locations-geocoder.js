export default class LocationsGeocoder {
	
	// Get geocoder object (initialize only once)
	static get geocoder() {
		delete this.geocoder;
		return this.geocoder = new google.maps.Geocoder();
	}
	
	// Submit geocoding query
	static query( caller, address ) {
		
		// Check lock
		if( caller.data( 'isLocked' ) ) {
			return;
		}
		
		// Prepare query
		let query = {};
		query.address = address.trim();
		query.componentRestrictions = {};
		
		// Validate query
		if( !query.address ) {
			alert( locsearch.alerts.empty_address );
			return;
		}
		
		// Send geocode request
		caller.trigger( 'locsearch_geocode_lock' );
		this.geocoder.geocode( query, (results, status) => {
			caller.trigger( 'locsearch_geocode_unlock' );
			this.geocodeReadErrors( results, status );
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
	static geocodeReadErrors( results, status ) {
		if( status == 'INVALID_REQUEST' ) {
			alert( locsearch.alerts.invalid_request );
		} else if( status == 'OVER_QUERY_LIMIT' ) {
			alert( locsearch.alerts.query_limit );
		} else if( status == 'ZERO_RESULTS' || ( status == 'OK' && !results.length ) ) {
			alert( locsearch.alerts.no_results );
		} else if( status != 'OK' ) {
			// UNKNOWN_ERROR and REQUEST_DENIED
			alert( locsearch.alerts.unknown_error );
		}
	}
	
}
