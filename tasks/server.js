const { watch, series } = require('gulp'),
	{ serverConfig, serverPHPconfig, serverPHP: serverPHPrun } = require('../gulpfile.config'),
	browserSync = require('browser-sync'), // плагин перезагрузки браузера
	server = browserSync.create(),
	{ init } = server,
	reload = async () => server.reload();

module.exports = function server_task() {
	return serverPHPrun ? init(serverConfig) : series(async () => init(serverConfig), serverPHP); // локальный сервер
	//browserSync(serverConfig);

	//watch(paths.watch.js, series('dev:js', server.reload));
	//watch(paths.watch.js).on('change', server.reload);

	//watch(paths.watch.html, series('dev:html', reload));
	//watch(paths.watch.scss, series('dev:scss', reload));
	//watch(paths.watch.js, series('dev:js', reload));
};
