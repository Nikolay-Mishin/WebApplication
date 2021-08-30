const { watch, series } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	//{ server, reload } = require('./helpers/helpers');
	reload = require('browser-sync').reload; // плагин перезагрузки браузера

module.exports = async function watch_all() {
	watch(paths.watch.html, series('dev:html'), reload({ stream: true }));
	watch(paths.watch.scss, series('dev:scss'), reload({ stream: true }));
	watch(paths.watch.js, series('dev:js'), reload({ stream: true }));
};
