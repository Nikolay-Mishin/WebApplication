const {
	config: { serverConfig, serverPHP: serverPHPrun },
	modules: {
		gulp: { watch, series },
		server: { init },
		reload, _reload, browserSync
	}
} = require('./helpers/helpers'),
	{ serverPHP } = require('./helpers/tasks');

module.exports = function server_task() {
	return serverPHPrun ? init(serverConfig) : series(() => init(serverConfig), serverPHP); // локальный сервер
	//browserSync(serverConfig);

	//watch(paths.watch.js, series('dev:js', _reload));
	//watch(paths.watch.js).on('change', _reload);

	//watch(paths.watch.html, series('dev:html', reload));
	//watch(paths.watch.scss, series('dev:scss', reload));
	//watch(paths.watch.js, series('dev:js', reload));
};
