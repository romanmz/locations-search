export default class LocationsMapMarker {
	
	// Create marker and add it to the provided map
	constructor( map, location ) {
		this.map = map;
		this.location = location;
		this.position = { lat: location.lat, lng: location.lng };
		this.marker = new google.maps.Marker({
			map: map.map,
			position: new google.maps.LatLng( location.lat, location.lng ),
			label: location.marker_label,
		});
		this.infoWindow = this.addInfoWindow( location.info_window );
		this.deactivate();
		google.maps.event.addListener( this.marker, 'click', this.onClick.bind( this ) );
	}
	
	// Generates an 'info window' that opens when a user clicks on the marker
	addInfoWindow( content ) {
		if( !content ) {
			return null;
		}
		return new google.maps.InfoWindow({
			position: new google.maps.LatLng( this.position.lat, this.position.lng ),
			content: content,
			pixelOffset: new google.maps.Size( 0, -30 ),
		});
	}
	
	// Activates the marker
	activate() {
		if( this.location.marker_images && this.location.marker_images.active ) {
			this.replaceIcon( this.location.marker_images.active );
		}
		if( this.infoWindow ) {
			this.infoWindow.open( this.map.map );
		}
	}
	
	// Deactivates the marker
	deactivate() {
		if( this.location.marker_images && this.location.marker_images.default ) {
			this.replaceIcon( this.location.marker_images.default );
		}
		if( this.infoWindow ) {
			this.infoWindow.close();
		}
	}
	
	// Create and assign a new marker icon from the provided image data
	replaceIcon( imageData ) {
		let iconData = {
			url: imageData.url,
			size: new google.maps.Size( imageData.size[0], imageData.size[1] ),
			scaledSize: new google.maps.Size( imageData.scaledSize[0], imageData.scaledSize[1] ),
			origin: new google.maps.Point( imageData.origin[0], imageData.origin[1] ),
			anchor: new google.maps.Point( imageData.anchor[0], imageData.anchor[1] ),
			labelOrigin: new google.maps.Point( imageData.labelOrigin[0], imageData.labelOrigin[1] ),
		};
		this.marker.setIcon( iconData );
		if( this.infoWindow ) {
			this.infoWindow.setOptions({
				pixelOffset: new google.maps.Size( 0, ( iconData.scaledSize.height * -1 ) ),
			});
		}
	}
	
	// Delete self
	delete() {
		this.deactivate();
		this.marker.setMap( null );
	}
	
	// Trigger actions when the user clicks on the marker
	onClick() {
		this.map.markers.forEach( marker => marker.deactivate() );
		this.activate();
	}
	
}
