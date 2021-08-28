const { paths } = require('../gulpfile.config'),
	{ src, dest } = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	htmlclean = require('gulp-htmlclean');

module.exports = function build_html() {
	return src(paths.src.html)
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(htmlclean())
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.html));
};
