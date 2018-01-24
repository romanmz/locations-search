export default class LocationsDatabase {
	
	// Prepare a geocode result and submit a database query
	static queryFromGeocode( caller, result ) {
		let lat = result.geometry.location.lat();
		let lng = result.geometry.location.lng();
		this.databaseQuery( caller, lat, lng );
	}
	
	// Submit a database query
	static databaseQuery( caller, lat, lng ) {
		
		// Check lock
		if( caller.data( 'isLocked' ) ) {
			return;
		}
		
		// Prepare query
		let query = {};
		query.action = 'locations_map_search';
		query.lat = lat;
		query.lng = lng;
		
		// Send query
		caller.trigger( 'locsearch_database_lock' );
		if( typeof fetch == 'function' ) {
			
			// Prepare data
			let headers = new Headers({ 'Accept': 'application/json' });
			let formData = new FormData();
			for( let key in query ) {
				if( query.hasOwnProperty( key ) ) {
					formData.append( key, query[key] );
				}
			}
			
			// Submit
			fetch( locsearch.ajax_url, {method: 'POST', headers, body: formData} )
			.then( response => {
				caller.trigger( 'locsearch_database_unlock' );
				if( response.ok ) {
					return response.json();
				}
				throw new Error( response.statusText );
			})
			.then( response => {
				caller.trigger( 'locsearch_database_results', [response] );
			}).catch( error => {
				alert( `Error: ${error.message}` );
			});
			
		} else {
			
			jQuery.post({
				url:      locsearch.ajax_url,
				data:     query,
				dataType: 'json',
				error: function( jqXHR, status, error ) {
					alert( `Error: ${error}` );
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
	}
	
}
