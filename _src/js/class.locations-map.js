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
		let newBounds = this.searchRadius ? this.searchRadius.getBounds() : new google.maps.LatLngBounds();
		this.markers.forEach( m => { newBounds.extend( m.marker.getPosition() ) } );
		this.map.fitBounds( newBounds );
		if( this.map.getZoom() > locsearch.map_attributes.max_zoom ) {
			this.map.setZoom( locsearch.map_attributes.max_zoom );
		}
	}
	
	// Create and add markers from a list of locations (deletes all previous markers)
	addMarkersFromLocations( locations ) {
		this.removeAllMarkers();
		this.markers = locations.map( location => new LocationsMapMarker( this, location ) );
		if( this.markerClusterer ) {
			this.markerClusterer.addMarkers( this.markers.map( m => m.marker ) );
		}
		this.checkZoomLevel();
	}
	
	// Delete all existing markers
	removeAllMarkers() {
		this.markers.forEach( marker => marker.delete() );
		this.markers = [];
		if( this.markerClusterer ) {
			this.markerClusterer.clearMarkers();
		}
	}
	
	// Draw search radius on the map
	drawRadius( lat, lng, radius ) {
		if( this.searchRadius ) {
			this.searchRadius.setMap( null );
		}
		this.searchRadius = new google.maps.Circle({
			strokeWeight: 0,
			fillColor: '#FF0000',
			fillOpacity: 0.1,
			map: this.map,
			center: {lat, lng},
			radius: radius * 1000,
			editable: true,
		});
		this.checkZoomLevel();
		google.maps.event.addListener( this.searchRadius, 'radius_changed', this.radiusResized.bind( this ) );
		google.maps.event.addListener( this.searchRadius, 'center_changed', this.radiusMoved.bind( this ) );
		return this.searchRadius;
	}
	
	// Callbacks after resizing or moving around the search area
	radiusResized() {
		if( this.searchRadius.getRadius() > locsearch.map_attributes.max_radius * 1000 ) {
			this.searchRadius.setRadius( locsearch.map_attributes.max_radius * 1000 );
		}
		this.checkZoomLevel();
	}
	radiusMoved() {
		this.checkZoomLevel();
	}
	
}
