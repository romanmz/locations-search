let mix = require('laravel-mix');
mix.js([
	'_src/js/shortcodes.js',
], 'assets/js/shortcodes.js');
mix.options({
	processCssUrls: false
});
mix.browserSync({
	proxy: 'localhost/wordpress',
	files: [
		'**/*.php',
		'assets/js/*.js',
		'assets/css/*.css'
	]
});
mix.disableNotifications();
mix.sourceMaps();
