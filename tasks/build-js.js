const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, error, notify } = require('./_helpers'),
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function build_js() {
	return src(paths.src.js, lastRun(build_js))
		.pipe(dest(paths.build.js))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify().on('error', error))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(paths.build.js))
		.pipe(notify('build:js'));
};
