export default class LocationsDatabase {
	
	// Gets useful info from a geocode result to be used on the db query
	static getGeocodeData( result ) {
		let db_fields = {
			'country': 'country',
			'administrative_area_level_1': 'state',
			'postal_code': 'postcode',
			'locality': 'city',
		};
		let result_type = result.types.find( type => db_fields[type] );
		if( result_type ) {
			let result_data = result.address_components.find( component => component.types.includes( result_type ) );
			return {
				code: result_data.short_name,
				name: result_data.long_name,
				field: db_fields[result_type],
			}
		}
		return null;
	}
	
	// Submit a database query
	static query( lat, lng, radius ) {
		return new Promise( (resolve, reject) => {
			
			// Prepare query
			let query = {
				'action': 'locations_search',
				lat,
				lng,
				search_radius: radius,
			};
			
			if( typeof fetch == 'function' ) {
				// If fetch is available, use it
				let headers = new Headers({ 'Accept': 'application/json' });
				let formData = new FormData();
				for( let key in query ) {
					if( query.hasOwnProperty( key ) ) {
						formData.append( key, query[key] );
					}
				}
				fetch( locsearch.ajax_url, {method: 'POST', headers, body: formData} )
					.then( result => {
						if( !result.ok ) reject( Error( result.statusText ) );
						return result.json();
					})
					.then( resolve ).catch( reject );
			} else {
				// Otherwise fallback to jQuery
				jQuery.post({
					url:      locsearch.ajax_url,
					data:     query,
					dataType: 'json',
					error: function( jqXHR, status, error ) {
						reject( Error( `Error: ${error}` ) );
					},
					success: function( locations, status, jqXHR ) {
						resolve( locations );
					},
				});
			}
			
		});
	}
	
}
