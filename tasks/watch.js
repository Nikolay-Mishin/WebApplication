import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: {
		gulp: { watch, series },
		$reload
	}
} = h;

export default async () => {
	watch(paths.watch.html, series('dev:html'), $reload({ stream: true }));
	watch(paths.watch.scss, series('dev:scss'), $reload({ stream: true }));
	watch(paths.watch.js, series('dev:js'), $reload({ stream: true }));
}
