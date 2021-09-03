const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	h = require('./helpers/helpers'),
	{ lastRun, notify } = h;
	//reload = require('browser-sync').reload; // плагин перезагрузки браузера

module.exports = function php() {
	return src(paths.src.php, lastRun(php))
		.pipe(dest(paths.build.html))
		.pipe(notify(`${h.mode}:php`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
