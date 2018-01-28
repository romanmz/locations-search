import LocationsMap from './class.locations-map.js';
import LocationsGeolocation from './class.locations-geolocation.js';
import LocationsGeocoder from './class.locations-geocoder.js';
import LocationsDatabase from './class.locations-database.js';
jQuery(document).ready(function($){
	
	// Check Google Maps API
	if( typeof google !== 'object' ) {
		alert( locsearch.alerts.api_unavailable );
		return;
	}
	
	// Generate locations maps
	$('.locsearch_map').each(function(){
		if( $(this).closest('.locsearch_box').length > 0 ) {
			return;
		}
		let map = new LocationsMap( this );
		map.addMarkersFromLocations( $(this).data('locations') );
	});
	
	// Initialize search boxes
	$('.locsearch_box').each(function(){
		
		
		// Init objects
		// ------------------------------
		let box = $(this);
		let form = box.find('.locsearch_form');
		let messagesBox = box.find('.locsearch_messages');
		let resultsBox = box.find('.locsearch_results');
		let mapBox = box.find('.locsearch_map');
		let addressField = form.find( 'input[name=address]' );
		let map = new LocationsMap( mapBox[0] );
		
		
		// Init functions
		// ------------------------------
		
		// Lock/unlock search box
		function lockSearch() {
			box.data( 'isLocked', true );
			box.addClass( 'loading' );
			box.find( ':input' ).prop( 'disabled', true );
		}
		function unlockSearch() {
			box.data( 'isLocked', false );
			box.removeClass( 'loading' );
			box.find( ':input' ).prop( 'disabled', false );
		}
		
		// Search database based on the user's current location
		function userLocationDetected( latLng ) {
			databaseRequest( latLng.lat, latLng.lng, locsearch.map_attributes.search_radius, locsearch.text.your_location );
		}
		function requestUserLocation() {
			if( addressField.val().trim() == '' ) {
				LocationsGeolocation.requestLocation()
					.then( userLocationDetected )
					.catch( e=>{} );
			}
		}
		
		// Use geocoding to convert addresses into coordinates
		function geocodeRequest( address ) {
			if( box.data( 'isLocked' ) ) return;
			lockSearch();
			LocationsGeocoder.query( address )
				.finally( unlockSearch )
				.then( geocodeResponse )
				.catch( e => alert( `Error: ${e.message}` ) );
		}
		function geocodeResponse( results ) {
			if( results.length === 1 ) {
				searchDatabaseFromGeocode( results[0] );
			} else if( results.length > 1 ) {
				showGeocodeAlternatives( results );
			}
		}
		function searchDatabaseFromGeocode( result ) {
			databaseRequest( result.geometry.location.lat(), result.geometry.location.lng(), locsearch.map_attributes.search_radius, result.formatted_address );
		}
		function showGeocodeAlternatives( results ) {
			messagesBox.html( '<p>'+locsearch.text.did_you_mean+'</p>' );
			let list = $('<ul>');
			results.forEach( result => {
				let item = $('<li>');
				let link = $('<a>',{ href: '#', text: result.formatted_address });
				link.on( 'click', (e) => {
					e.preventDefault();
					searchDatabaseFromGeocode( result );
				});
				list.append( item.append( link ) );
			});
			messagesBox.append( list );
		}
		
		// Database results
		function databaseRequest( lat, lng, radius, referenceText, newRadius=true ) {
			if( box.data( 'isLocked' ) ) return;
			lockSearch();
			messagesBox.html( referenceText ? `<p>${locsearch.text.searching_near} ${referenceText}</p>` : '' );
			
			// Draw a new radius area, and re-submit database query if the user resizes or moves the radius
			if( newRadius ) {
				let mapRadius = map.drawRadius( lat, lng, radius );
				let onRadiusChange = ()=>{
					databaseRequest( mapRadius.getCenter().lat(), mapRadius.getCenter().lng(), mapRadius.getRadius()/1000, '', false );
				};
				google.maps.event.addListener( mapRadius, 'radius_changed', onRadiusChange );
				google.maps.event.addListener( mapRadius, 'center_changed', onRadiusChange );
			}
			
			// Submit database query
			LocationsDatabase.query( lat, lng, radius )
				.finally( unlockSearch )
				.then( databaseResponse )
				.catch( e => alert( `Error: ${e.message}` ) );
		}
		function databaseResponse( locations ) {
			if( !locations.length ) {
				messagesBox.append( '<p>'+locsearch.text['0_results']+'</p>' );
			} else if( locations.length == 1 ) {
				messagesBox.append( '<p>'+locsearch.text['1_result']+'</p>' );
			} else {
				messagesBox.append( '<p>'+locsearch.text.many_results.replace( '%s', locations.length ) +'</p>' );
			}
			map.addMarkersFromLocations( locations );
			
			// Update results list
			resultsBox.empty();
			locations.forEach( location => {
				if( !location.list_item ) return;
				let listItem = $(location.list_item);
				resultsBox.append( listItem );
				google.maps.event.addListener( location.marker.marker, 'click', () => {
					resultsBox.animate({ scrollTop: resultsBox.scrollTop() + listItem.position().top });
					resultsBox.children( '.locsearch_result' ).removeClass( 'selected' );
					listItem.addClass( 'selected' );
				});
				listItem.on( 'click', e => {
					if( e.target.nodeName.toLowerCase() == 'a' ) return;
					google.maps.event.trigger( location.marker.marker, 'click' );
				});
			});
		}
		
		
		// Handle user actions
		// ------------------------------
		
		// Form submission
		form.on( 'submit', function(e){
			e.preventDefault();
			geocodeRequest( addressField.val() );
		});
		
		// Trigger automatic searches
		if( form.data( 'locsearch-autosearch' ) ) {
			form.trigger( 'submit' );
		} else if( LocationsGeolocation.cachedLocation ) {
			userLocationDetected( LocationsGeolocation.cachedLocation );
		} else {
			requestUserLocation();
		}
		
		
	});
});
