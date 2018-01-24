import LocationsMap from './class.locations-map.js';
import LocationsMapMarker from './class.locations-map-marker.js';
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
		let map = new LocationsMap( this );
		map.addMarkersFromLocations( $(this).data('locations') );
	});
	
	// Initialize search boxes
	$('.locsearch_box').each(function(){
		
		// Init objects
		let box = $(this);
		let form = box.find('.locsearch_box__form');
		let messagesBox = box.find('.locsearch_box__messages');
		let mapBox = box.find('.locsearch_box__map');
		let addressField = form.find( 'input[name=address]' );
		let map = new LocationsMap( mapBox[0] );
		
		// Submit geocoding request
		form.on( 'submit', function(e){
			e.preventDefault();
			LocationsGeocoder.query( box, addressField.val() );
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
			LocationsDatabase.queryFromGeocode( box, result );
		});
		box.on( 'locsearch_geocode_many_results', function( e, results ){
			map.removeAllMarkers();
			let list = $('<ul>');
			results.forEach(function( result, i ){
				let item = $('<li>');
				let link = $('<a>',{ href: '#', text: result.formatted_address });
				link.on( 'click', function(e){
					e.preventDefault();
					LocationsDatabase.queryFromGeocode( box, result );
				});
				list.append( item.append( link ) );
			});
			messagesBox.html( '<div>'+locsearch.text.did_you_mean+'</div>' );
			messagesBox.append( list );
		});
		
		// Process database query results
		box.on( 'locsearch_database_results', function( e, locations ){
			
			// Display number of results
			if( !locations.length ) {
				messagesBox.html( '<p>'+locsearch.text['0_results']+'</p>' );
			} else if( locations.length == 1 ) {
				messagesBox.html( '<p>'+locsearch.text['1_result']+'</p>' );
			} else {
				messagesBox.html( '<p>'+locsearch.text.many_results.replace( '%s', locations.length ) +'</p>' );
			}
			
			// Add markers
			map.addMarkersFromLocations( locations );
			
		});
		
	});
});
