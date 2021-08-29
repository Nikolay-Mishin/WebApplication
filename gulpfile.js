const { task, src, dest, watch, lastRun, series, parallel } = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(), // сервер + перезагрузка 
	babel = require('gulp-babel'),                  // для работы с JS 
	concat = require('gulp-concat');                // объединение файлов в один

//const clean = require('./tasks/clean');
//exports.clean = clean;
task('clean', require('./tasks/clean'));

function HTML() {
	return src('app/**/*.html', { since: lastRun(HTML) })
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
}
exports.HTML = HTML;

function SASS() {
	return src('app/assets/sass/**/*.sass')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'nested'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('app/assets/css/'))
		.pipe(dest('dist/assets/css/'))
		.pipe(browserSync.stream());
}
exports.SASS = SASS;

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
		.pipe(browserSync.stream());
}
exports.scripts = scripts;

function myServer() {
	browserSync.init({
		server: {
			baseDir: 'app' // папка для локального сервера 
		},
		notify: false
	});

	watch('app/**/*.html', { usePolling: true }, HTML);             // следим за HTML 
	watch('app/assets/sass/**/*.sass', { usePolling: true }, SASS); // следим за SASS
	watch('app/assets/js/**/*.js', { usePolling: true }, scripts);  // следим за JS
}

exports.default = series('clean', parallel(HTML, SASS, scripts), myServer);
