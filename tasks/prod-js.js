const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, error, notify/*, server*/ } = require('./helpers/helpers'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function prod_js() {
	return src(paths.src.js, lastRun(prod_js))
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify().on('error', error)) // минификация
		.pipe(dest(paths.build.js))
		.pipe(notify('prod:js'))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
