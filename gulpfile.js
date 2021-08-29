const { src, dest, watch, lastRun, series, parallel } = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(), // сервер + перезагрузка 
	babel = require('gulp-babel'),                  // для работы с JS 
	concat = require('gulp-concat');                // объединение файлов в один

exports.clean = require('./tasks/clean');

function html() {
	return src('app/**/*.html', { since: lastRun(html) })
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
}
exports.html = html;

function Sass() {
	return src('app/assets/sass/**/*.sass', { since: lastRun(Sass) })
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'nested'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app/assets/css/'))
		.pipe(dest('dist/assets/css/'))
		.pipe(browserSync.stream());
}
exports.sass = Sass;

function scripts() {
	return src([
		'app/assets/js/script_1.js',
		'app/assets/js/script_2.js',
		'app/assets/js/main.js'
	], { since: lastRun(scripts) })
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write("."))
		.pipe(dest('app/assets/js/'))
		.pipe(dest('dist/assets/js/'))
		.pipe(browserSync.stream());
}
exports.scripts = scripts;

function server() {
	browserSync.init({
		server: {
			baseDir: 'app' // папка для локального сервера 
		},
		notify: false
	});

	watch('app/**/*.html', { usePolling: true }, html);             // следим за HTML
	watch('app/assets/sass/**/*.sass', { usePolling: true }, Sass); // следим за SASS
	watch('app/assets/js/**/*.js', { usePolling: true }, scripts);  // следим за JS
}

const { clean } = exports;
exports.default = series(clean, parallel(html, Sass, scripts), server);
