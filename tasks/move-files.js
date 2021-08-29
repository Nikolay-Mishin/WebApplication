const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun } = require('./_helpers');

module.exports = function move_files() {
	src('files/**/*.{html,htm}', lastRun(move_files)).pipe(dest(paths.build.all));
	src('files/**/*.pug', lastRun(move_files)).pipe(dest(paths.build.pug));
	src('files/**/*.css', lastRun(move_files)).pipe(dest(paths.build.css));
	src('files/**/*.js', lastRun(move_files)).pipe(dest(paths.build.js));
	return src('files/assets/**/*.{jpeg,jpg,png,svg,gif}', lastRun(move_files)).pipe(dest(paths.build.img));
};
