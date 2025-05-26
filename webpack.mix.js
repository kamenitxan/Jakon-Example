let mix = require('laravel-mix');

mix.js('modules/backend/src/frontend/docs/js/**/*.js', 'js/docs.js')
	.styles('modules/backend/src/frontend/docs/css/**/*.css', 'modules/backend/static/docs/css/docs.css')
	.autoload({
		jquery: ['$', 'window.jQuery', "jQuery"],
	})
	.extract()
	.setPublicPath('modules/backend/static/docs');