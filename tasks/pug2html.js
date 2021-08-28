const config = require('../gulpfile.config'),
	gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	pug = require('gulp-pug'),
	pugLinter = require('gulp-pug-linter'),
	htmlValidator = require('gulp-w3c-html-validator'),
	bemValidator = require('gulp-html-bem-validator');

module.exports = function pug2html() {
	return gulp.src('src/pages/*.pug')
		.pipe(plumber())
		.pipe(pugLinter({ reporter: 'default' }))
		.pipe(pug({ pretty: config.pug2html.beautifyHtml }))
		.pipe(htmlValidator())
		.pipe(bemValidator())
		.pipe(gulp.dest('build'));
};
