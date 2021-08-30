const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun/*, server*/ } = require('./helpers/helpers'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	realFavicon = require('gulp-real-favicon'); // генератор фавиконок

module.exports = function prod_html() {
	return src(paths.src.html, lastRun(prod_html))
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(paths.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
