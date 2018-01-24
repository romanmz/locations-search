export default class LocationsGeolocation {
	
	// Return a previously saved user location
	static get cachedLocation() {
		if( sessionStorage.getItem( 'userLat' ) === null || sessionStorage.getItem( 'userLng' ) === null ) {
			return null;
		}
		return {
			lat: sessionStorage.getItem( 'userLat' ),
			lng: sessionStorage.getItem( 'userLng' ),
		};
	}
	
	// Detect the user's current location and cache it
	static requestLocation() {
		navigator.geolocation.getCurrentPosition(
			location => {
				sessionStorage.setItem( 'userLat', location.coords.latitude );
				sessionStorage.setItem( 'userLng', location.coords.longitude );
			},
			error => {
				console.log( error );
			},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	}
	
}
