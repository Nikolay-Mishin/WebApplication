const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	h = require('./helpers/helpers'),
	{ lastRun, arg, notify/*, server*/ } = h,
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	_if = require('gulp-if'), // плагин для условий
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	htmlclean = require('gulp-htmlclean'), // collapse whitespace
	realFavicon = require('gulp-real-favicon'); // генератор фавиконок

module.exports = function html() {
	return src(paths.src.html, lastRun(html))
		.pipe(_if(h.dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(_if(h.dev && arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(_if(h.dev, htmlclean()))
		.pipe(_if(h.prod, htmlmin({ collapseWhitespace: true })))
		.pipe(_if(h.dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.html))
		.pipe(notify(`${h.mode}:html`))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
