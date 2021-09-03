const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, arg, notify } = require('./helpers/helpers'),
	//reload = require('browser-sync').reload, // плагин перезагрузки браузера
	_if = require('gulp-if'), // плагин для условий
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	htmlclean = require('gulp-htmlclean'), // collapse whitespace
	realFavicon = require('gulp-real-favicon'); // генератор фавиконок

module.exports = function dev_html() {
	return src(paths.src.html, lastRun(dev_html))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(_if(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(htmlclean())
		.pipe(dest(paths.build.root))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(notify('dev:html'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
