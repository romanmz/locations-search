import LocationsMapMarker from './class.locations-map-marker.js';
export default class LocationsMap {
	
	// Create map and set default attributes
	constructor( container ) {
		this.container = container;
		this.map = new google.maps.Map( container, {
			styles: locsearch.map_attributes.styles,
		});
		this.markers = [];
		if( typeof MarkerClusterer === 'function' && locsearch.map_attributes.clusters_image ) {
			this.markerClusterer = new MarkerClusterer( this.map, [], locsearch.map_attributes.clusters_image );
		} else {
			this.markerClusterer = null;
		}
		this.resetMapLocation();
	}
	
	// Sets the map to the default location
	resetMapLocation() {
		this.map.setCenter({
			lat: locsearch.map_attributes.initial_lat,
			lng: locsearch.map_attributes.initial_lng,
		});
		this.map.setZoom( locsearch.map_attributes.max_zoom );
	}
	
	// Enforce max zoom level
	checkZoomLevel() {
		if( this.map.getZoom() > locsearch.map_attributes.max_zoom ) {
			this.map.setZoom( locsearch.map_attributes.max_zoom );
		}
	}
	
	// Create and add markers from a list of locations (deletes all previous markers)
	addMarkersFromLocations( locations ) {
		this.removeAllMarkers();
		let newMarkers = [];
		let newBounds = new google.maps.LatLngBounds();
		locations.forEach((location, i) => {
			let newMarker = new LocationsMapMarker( this.map, location.lat, location.lng, location.title );
			if( location.images.marker ) {
				newMarker.replaceIcon( location.images.marker );
			}
			newMarkers.push( newMarker );
			newBounds.extend( location );
		});
		if( newMarkers.length ) {
			this.map.fitBounds( newBounds );
		}
		if( this.markerClusterer ) {
			this.markerClusterer.addMarkers( newMarkers.map( m=>m.marker ) );
		}
		this.checkZoomLevel();
		this.markers = newMarkers;
	}
	
	// Delete all existing markers
	removeAllMarkers() {
		this.markers.forEach( marker=>{marker.delete()} );
		this.markers = [];
		if( this.markerClusterer ) {
			this.markerClusterer.clearMarkers();
		}
	}
	
}
