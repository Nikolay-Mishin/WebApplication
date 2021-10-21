import h from './helpers/helpers.js';
const {
	lastRun, error, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		$reload, stream, sourcemaps, rigger, uglify
	}
} = h;

export default function dev_js() {
	return src(paths.src.js, lastRun(dev_js)) // main файл
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(rigger()) // rigger
		.pipe(dest(paths.build.js)) // готовый файл в build
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify('dev:js'));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
