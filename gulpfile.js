/// <binding AfterBuild='build' ProjectOpened='watch:webpack' />
//'use strict';

function HTML() {
	return src('app/**/*.html', { since: lastRun(HTML) })
		.pipe(dest('dist/'))
		.pipe(browserSync.stream())
}
exports.HTML = HTML;

const config = require('./gulpfile.config'),
	path = require('path'), // path
	{ src, dest, watch, lastRun, series, parallel } = require('gulp'), // сам gulp
	gulp = require('gulp'), // сам gulp
	browserSync = require("browser-sync"), // плагин перезагрузки браузера
	reload = browserSync.reload,
	rimraf = require('rimraf'),// удаление файлов
	pug = require('gulp-pug'), // плагин компиляции pug
	sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	prefixer = require('gulp-autoprefixer'), // плагин расстановки префиксов
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	htmlmin = require('gulp-htmlmin'), // плагин сжатия html
	inlineCss = require('gulp-inline-css'),
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'), // плагин сжатия js
	notify = require('gulp-notify'), // отладка
	plumber = require('gulp-plumber'), // отладка
	gutil = require('gulp-util'), // отладка
	gulpif = require('gulp-if'), // плагин для условий
	realFavicon = require('gulp-real-favicon'), // генератор фавиконок
	imagemin = require('gulp-imagemin'), // оптимизация картинок
	ImgMinify = require('imgminify'), // оптимизация картинок
	fs = require('fs'), // работа с файловой системой 
	htmlclean = require('gulp-htmlclean'),
	webpack = require('webpack'), // webpack
	webpackStream = require('webpack-stream'), // webpack
	webpackConfig = require('./webpack.config.js'), // webpack.config
	dir = require('path'); // path

function scripts() {
	return src([
		'app/assets/js/script_1.js',
		'app/assets/js/script_2.js',
		'app/assets/js/main.js'
	], { since: lastRun(HTML) })
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write("."))
		.pipe(dest('app/assets/js/'))
		.pipe(dest('dist/assets/js/'))
		.pipe(browserSync.stream())
}
exports.scripts = scripts;

function myServer() {
	browserSync.init({
		server: {
			baseDir: 'app' // папка для локального сервера 
		},
		notify: false
	});

	watch('app/**/*.html', { usePolling: true }, HTML);            // следим за HTML 
	watch('app/assets/sass/**/*.sass', { usePolling: true }, SASS) // следим за SASS 
	watch('app/assets/js/**/*.js', { usePolling: true }, scripts)  // следим за JS 
}

exports.default = series(HTML, SASS, scripts, myServer);
