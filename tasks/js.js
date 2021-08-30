const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, error, notify/*, server*/ } = require('./helpers/helpers'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function js() {
	return src(paths.src.js, lastRun(dev_js)) // main файл
		.pipe(rigger()) // rigger
		.pipe(dest(paths.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify('build:js'))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());

	return src(paths.src.js, lastRun(prod_js))
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify().on('error', error)) // минификация
		.pipe(dest(paths.build.js))
		.pipe(notify('build:js'))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());

	return src(paths.src.js, lastRun(build_js))
		.pipe(dest(paths.build.js))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify().on('error', error))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(paths.build.js))
		.pipe(notify('build:js'));
};
