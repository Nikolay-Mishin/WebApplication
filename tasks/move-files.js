const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config');

module.exports = function move_files() {
	src('files/**/*.{html,htm}').pipe(dest(paths.build.all));
	src('files/**/*.pug').pipe(dest(paths.build.pug));
	src('files/**/*.css').pipe(dest(paths.build.css));
	src('files/**/*.js').pipe(dest(paths.build.js));
	return src('files/assets/**/*.{jpeg,jpg,png,svg,gif}').pipe(dest(paths.build.img));
};
