const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun } = require('./_helpers'),
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	htmlclean = require('gulp-htmlclean');

module.exports = function build_html() {
	return src(paths.src.html, lastRun(build_html))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(htmlclean())
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.html));
};
