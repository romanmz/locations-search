export default class LocationsMapMarker {
	
	// Create marker and add it to the provided map
	constructor( map, lat, lng, label ) {
		this.map = map;
		this.position = { lat, lng };
		this.label = label;
		this.marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng( lat, lng ),
			label: label,
		});
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
	}
	
	// Delete self
	delete() {
		this.marker.setMap( null );
	}
	
}
