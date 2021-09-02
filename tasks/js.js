const { src, dest } = require('gulp'),
	{ paths, webpackConfig } = require('../gulpfile.config'),
	_webpackConfig = require(webpackConfig),
	h = require('./helpers/helpers'),
	{ lastRun, error, notify } = h,
	//reload = require('browser-sync').reload, // плагин перезагрузки браузера
	_if = require('gulp-if'), // плагин для условий
	rename = require('gulp-rename'), // плагин переименования файлов
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'), // плагин сжатия js
	webpack = require('webpack'), // webpack
	webpackStream = require('webpack-stream'); // webpack

module.exports = function js() {
	if (h.useWebpack) {
		return src(paths.src.js, lastRun(js))
			.pipe(webpackStream(_webpackConfig), webpack)
			.pipe(dest(paths.build.js))
			.pipe(notify(`${h.mode}:js`));
	}
	return src(paths.src.js, lastRun(js)) // main файл
		.pipe(_if(h.dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(_if(h.dev, rigger())) // rigger
		.pipe(_if(h.dev, dest(paths.build.js))) // готовый файл в build
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(_if(h.dev, rename({ suffix: '.min' }))) // переименовывание файла
		.pipe(_if(h.dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify(`${h.mode}:js`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
