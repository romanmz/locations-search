export default class LocationsGeocoder {
	
	// Get geocoder object (initialize only once)
	static get geocoder() {
		delete this.geocoder;
		return this.geocoder = new google.maps.Geocoder();
	}
	
	// reverse geocoding
	static reverseQuery( lat, lng ) {
		// let query = {}
		// query.location = new google.maps.LatLng( lat, lng );
		// query.placeId = string;
	}
	
	// Submit geocoding query
	static query( address ) {
		return new Promise( (resolve, reject) => {
			
			// Prepare query
			let query = {};
			query.address = address.trim();
			// query.bounds
			query.componentRestrictions = {
				// route
				// locality
				// administrativeArea
				// postalCode
			};
			
			// Apply 'focus country' from user settings
			if( locsearch.map_attributes.focus_country && !locsearch.map_attributes.focus_strict ) {
				query.region = locsearch.map_attributes.focus_country;
			}
			if( locsearch.map_attributes.focus_country && locsearch.map_attributes.focus_strict ) {
				query.componentRestrictions.country = locsearch.map_attributes.focus_country;
			}
			
			// Validate query
			if( !query.address ) {
				reject( Error( locsearch.alerts.empty_address ) );
			}
			
			// Send geocode request
			this.geocoder.geocode( query, (results, status) => {
				if( status != 'OK' ) {
					reject( Error( this.translateError( status ) ) );
				}
				resolve( results );
			});
			
		});
	}
	
	// Check for errors in received data
	static translateError( status ) {
		if( status == 'INVALID_REQUEST' ) {
			return locsearch.alerts.invalid_request;
		} else if( status == 'OVER_QUERY_LIMIT' ) {
			return locsearch.alerts.query_limit;
		} else if( status == 'ZERO_RESULTS' ) {
			return locsearch.alerts.no_results;
		} else if( status != 'OK' ) {
			// UNKNOWN_ERROR and REQUEST_DENIED
			return locsearch.alerts.unknown_error;
		}
	}
	
}
