jQuery(document).ready(function($){
	
	
	// Media Uploads
	// ==================================================
	$('.locsearch_mediaupload').each(function(){
		
		
		// Init Vars
		// ------------------------------
		var mediaLibrary;
		var container = $(this);
		var imagePreview = container.find( '.locsearch_mediaupload__preview' );
		var imageInput = container.find( '.locsearch_mediaupload__field' );
		var imageUpload = container.find( '.locsearch_mediaupload__upload' );
		var imageReset = container.find( '.locsearch_mediaupload__reset' );
		var allowedTypes = {
			type: 'image/png',
		}
		
		// Init buttons
		imageUpload.data( 'label-select', imageUpload.val() );
		if( imagePreview.find( 'img' ).length ) {
			imageUpload.val( imageUpload.data( 'label-replace' ) );
			imageReset.removeClass( 'hidden' );
		}
		
		
		// Init Functions
		// ------------------------------
		function openMediaLibrary() {
			
			// If the media frame already exists, reopen it.
			if( mediaLibrary ) {
				mediaLibrary.open();
				return;
			}
			
			// Create and open new media frame
			mediaLibrary = wp.media({
				title: container.data( 'frame-title' ),
				button: {
					text: container.data( 'frame-button-text' ),
				},
				multiple: false,
				library: allowedTypes,
			});
			mediaLibrary.on( 'select', selectedMedia );
			mediaLibrary.open();
			
		}
		function selectedMedia() {
			var item = mediaLibrary.state().get( 'selection' ).first().toJSON();
			if( item.sizes.medium ) {
				var itemURL = item.sizes.medium.url;
			} else if( item.sizes.large ) {
				var itemURL = item.sizes.large.url;
			} else {
				var itemURL = item.url;
			}
			imagePreview.html( '<img src="'+itemURL+'" alt="marker icon">' );
			imageInput.val( item.id );
			imageUpload.val( imageUpload.data( 'label-replace' ) );
			imageReset.removeClass( 'hidden' );
		}
		function resetMedia() {
			imagePreview.empty();
			imageInput.val( '' );
			imageUpload.val( imageUpload.data( 'label-select' ) );
			imageReset.addClass( 'hidden' );
		}
		
		
		// Bind Functions
		// ------------------------------
		imageUpload.on( 'click', function(e){
			e.preventDefault();
			openMediaLibrary();
		});
		imageReset.on( 'click', function(e){
			e.preventDefault();
			resetMedia();
		});
		
		
	});
});
