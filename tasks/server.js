const { watch, series } = require('gulp'),
	{ serverConfig } = require('../gulpfile.config'),
	browserSync = require('browser-sync'), // плагин перезагрузки браузера
	server = browserSync.create(),
	reload = async () => server.reload();

module.exports = function server_task() {
	return server.init(serverConfig);
	//browserSync(serverConfig); // локальный сервер

	//watch(paths.watch.html, series('dev:html'), reload);
	//watch(paths.watch.scss, series('dev:scss'), reload);
	//watch(paths.watch.js, series('dev:js'), reload);

	//done();
};
