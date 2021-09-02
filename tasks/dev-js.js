const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, error, notify } = require('./helpers/helpers'),
	//reload = require('browser-sync').reload, // плагин перезагрузки браузера
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function dev_js() {
	return src(paths.src.js, lastRun(dev_js)) // main файл
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(rigger()) // rigger
		.pipe(dest(paths.build.js)) // готовый файл в build
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify('dev:js'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
