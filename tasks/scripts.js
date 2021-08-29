const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	concat = require('concat'),
	babel = require('gulp-babel'),
	terser = require('terser'),
	gulpTerser = require('gulp-terser');

module.exports = function scripts() {
	return src(paths.src.js)
		.pipe(sourcemaps.init())
		.pipe(babel({
			//presets: ['env']
			presets: ['@babel/preset-env']
		}).on('error', babel.logError))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(paths.build.js))
		//.pipe(gulpTerser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulpTerser({}, terser.minify))
		.pipe(dest(paths.build.js));
};
