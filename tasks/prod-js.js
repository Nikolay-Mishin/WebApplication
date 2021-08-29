const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'); // плагин сжатия js

module.exports = function prod_js() {
	return src(paths.src.js)
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify()) // минификация
		.pipe(dest(paths.build.js))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
};
