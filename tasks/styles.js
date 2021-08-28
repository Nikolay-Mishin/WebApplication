const gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	shorthand = require('gulp-shorthand'),
	autoprefixer = require('gulp-autoprefixer'),
	gulpStylelint = require('gulp-stylelint'),
	rename = require("gulp-rename");

module.exports = function styles() {
	return gulp.src('src/styles/*.scss')
		.pipe(plumber())
		.pipe(gulpStylelint({
			failAfterError: false,
			reporters: [
				{
					formatter: 'string',
					console: true
				}
			]
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(shorthand())
		.pipe(cleanCSS({
			debug: true,
			compatibility: '*'
		}, details => {
			console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
		}))
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/css'));
};
