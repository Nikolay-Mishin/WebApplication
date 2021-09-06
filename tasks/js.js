const h = require('./helpers/helpers'),
	{
		lastRun, error, notify,
		config: { paths, webpackConfig },
		modules: {
			gulp: { src, dest },
			reload, stream, _if, rename, sourcemaps, rigger, uglify, webpack, webpackStream
		}
	} = h;

module.exports = function js() {
	const { dev, mode, useWebpack } = h;
	if (useWebpack) {
		return src(paths.src.js, lastRun(js))
			.pipe(webpackStream(require(webpackConfig)), webpack)
			.pipe(dest(paths.build.js))
			.pipe(notify(`${mode}:js`));
	}
	return src(paths.src.js, lastRun(js)) // main файл
		.pipe(_if(dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(_if(dev, rigger())) // rigger
		.pipe(_if(dev, dest(paths.build.js))) // готовый файл в build
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(_if(dev, rename({ suffix: '.min' }))) // переименовывание файла
		.pipe(_if(dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify(`${mode}:js`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
