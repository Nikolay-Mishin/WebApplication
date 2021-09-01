const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun, notify } = require('./helpers/helpers'),
	//reload = require('browser-sync').reload, // плагин перезагрузки браузера
	sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	prefixer = require('gulp-autoprefixer'); // плагин расстановки префиксов

module.exports = function prod_scss() {
	return src(paths.src.scss, lastRun(prod_scss))
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(dest(paths.build.css))
		.pipe(notify('prod:scss'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
