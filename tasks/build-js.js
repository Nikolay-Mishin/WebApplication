const { paths } = require('../gulpfile.config'),
	{ src, dest } = require('gulp'),
	{ error, notify } = require('./_helpers'),
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	uglify = require('gulp-uglify'), // плагин сжатия js
	rename = require('gulp-rename'); // плагин переименования файлов

module.exports = function build_js() {
	return src(paths.src.js)
		.pipe(dest(paths.build.js))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify().on('error', error))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(paths.build.js))
		.pipe(notify('build:js'));
};
