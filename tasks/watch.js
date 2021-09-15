import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: {
		gulp: { watch, series },
		_reload
	}
} = h;

export default async () => {
	watch(paths.watch.html, series('dev:html'), _reload({ stream: true }));
	watch(paths.watch.scss, series('dev:scss'), _reload({ stream: true }));
	watch(paths.watch.js, series('dev:js'), _reload({ stream: true }));
}
