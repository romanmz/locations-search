jQuery(document).ready(function($){
	
	
	// ==================================================
	// MAP FUNCTIONS
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
	// Generate locations maps
	$('.locsearch_map').each(function(){
		var map = createMap( this );
		var markers = addMarkers( map, $(this).data('locations') );
	});
});
