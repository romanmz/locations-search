let mix = require('laravel-mix');
mix.js(['_src/js/shortcodes.js'], 'assets/js/shortcodes.js');
mix.sass('_src/scss/edit-screen.scss', 'assets/css/');
mix.sass('_src/scss/edit-settings.scss', 'assets/css/');
mix.sass('_src/scss/frontend.scss', 'assets/css/');
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
