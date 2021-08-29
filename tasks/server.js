const { watch, series } = require('gulp'),
	{ serverConfig } = require('./gulpfile.config'),
	//{ server } = require('./_helpers');
	browserSync = require('browser-sync'), // плагин перезагрузки браузера
	server = browserSync.create();

function reload(done) {
	server.reload();
	done();
}

module.exports = function server_task(done) {
	server.init(serverConfig);
	//browserSync(serverConfig); // локальный сервер

	//watch(paths.watch.html, series('dev:html'), reload);
	//watch(paths.watch.scss, series('dev:scss'), reload);
	//watch(paths.watch.js, series('dev:js'), reload);

	done();
};
