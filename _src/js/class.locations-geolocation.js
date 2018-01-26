export default class LocationsGeolocation {
	
	// Return a previously saved user location
	static get cachedLocation() {
		if( sessionStorage.getItem( 'userLat' ) === null || sessionStorage.getItem( 'userLng' ) === null ) {
			return null;
		}
		return {
			lat: parseFloat( sessionStorage.getItem( 'userLat' ) ),
			lng: parseFloat( sessionStorage.getItem( 'userLng' ) ),
		};
	}
	
	// Detect the user's current location and cache it
	static requestLocation() {
		return new Promise( (resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				location => {
					sessionStorage.setItem( 'userLat', location.coords.latitude );
					sessionStorage.setItem( 'userLng', location.coords.longitude );
					resolve( this.cachedLocation );
				},
				error => {
					reject( Error( error.message ) );
				},
				{
					enableHighAccuracy: false,
					timeout: 10000,
					maximumAge: 0,
				}
			);
		});
	}
	
}
