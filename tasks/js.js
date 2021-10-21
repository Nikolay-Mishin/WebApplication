import h from './helpers/helpers.js';
const {
		lastRun, error, notify,
		config: { paths },
		modules: {
			gulp: { src, dest },
			$reload, stream, $if, rename, sourcemaps, rigger, uglify, webpack, webpackStream
		}
	} = h;

export default async function js() {
	const { dev, mode, useWebpack, webpackConfig } = h;
	if (useWebpack) {
		return src(paths.src.js, lastRun(js))
			.pipe(webpackStream(await webpackConfig), webpack)
			.pipe(dest(paths.build.js))
			.pipe(notify(`${mode}:js`));
	}
	return src(paths.src.js, lastRun(js)) // main файл
		.pipe($if(dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe($if(dev, rigger())) // rigger
		.pipe($if(dev, dest(paths.build.js))) // готовый файл в build
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe($if(dev, rename({ suffix: '.min' }))) // переименовывание файла
		.pipe($if(dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify(`${mode}:js`));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
