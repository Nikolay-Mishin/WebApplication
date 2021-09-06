import h from './helpers/helpers.js';
const {
	lastRun, error, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		reload, stream, rigger, uglify
	}
} = h;

export default function prod_js() {
	return src(paths.src.js, lastRun(dev_js)) // main файл
		.pipe(rigger()) // rigger
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify('prod:js'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
