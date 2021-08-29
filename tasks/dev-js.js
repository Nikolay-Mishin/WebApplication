const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function dev_js() {
	return src(paths.src.js) // main файл
		.pipe(rigger()) // rigger
		.pipe(dest(paths.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
};