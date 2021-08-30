const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	h = require('./helpers/helpers'),
	{ lastRun, error, notify/*, server*/ } = h,
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	_if = require('gulp-if'), // плагин для условий
	rename = require('gulp-rename'), // плагин переименования файлов
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function js() {
	if (h.useWebpack) {
		return src(paths.src.webpack, lastRun(js))
			.pipe(webpackStream(webpackConfig), webpack)
			.pipe(dest(paths.build.js))
			.pipe(notify(`${h.mode}:js`));
	}
	else {
		return src(paths.src.js, lastRun(js)) // main файл
		.pipe(rigger()) // rigger
			.pipe(_if(h.dev, dest(paths.build.js))) // готовый файл в build
			.pipe(_if(h.dev, sourcemaps.init())) // Инициализируем sourcemap
			.pipe(uglify().on('error', error)) // сжатие js
			.pipe(_if(h.dev, sourcemaps.write('.'))) // Пропишем карты
			.pipe(_if(h.dev, rename({ suffix: '.min' }))) // переименовывание файла
		.pipe(dest(paths.build.js)) // готовый файл min в build
			.pipe(notify(`${h.mode}:js`))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
	}
};
