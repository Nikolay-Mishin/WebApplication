import h from './helpers/helpers.js';
const {
		config: { serverConfig, serverPHP: serverPHPrun },
		modules: {
			gulp: { watch, series },
			server: { init },
			reload, $reload
		}
	} = h;

// локальный сервер
export default () => serverPHPrun ? init(serverConfig) : series(() => init(serverConfig), { serverPHP } = h.tasks)

//{
	//watch(paths.watch.html, series('dev:html', reload));
	//watch(paths.watch.scss, series('dev:scss', reload));
	//watch(paths.watch.js, series('dev:js', reload));

	//watch(paths.watch.js, series('dev:js', $reload));
	//watch(paths.watch.js).on('change', $reload);
//}
