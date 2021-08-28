const gulp = require('gulp'),
	server = require('browser-sync').create();

const imageMinify = require('./imageMinify'),
	svgSprite = require('./svgSprite'),
	styles = require('./styles'),
	pug2html = require('./pug2html'),
	scripts = require('./scripts'),
	copyDependencies = require('./copyDependencies');

function readyReload(cb) {
	server.reload();
	cb();
}

module.exports = function server(cb) {
	server.init({
		server: 'build',
		notify: false,
		open: true,
		cors: true
	});

	gulp.watch('src/img/*.{gif,png,jpg,svg,webp}', gulp.series(imageMinify, readyReload));
	gulp.watch('src/img/sprite/*.svg', gulp.series(svgSprite, readyReload));
	gulp.watch('src/styles/**/*.scss', gulp.series(styles, cb => gulp.src('build/css').pipe(server.stream()).on('end', cb)));
	gulp.watch('src/js/**/*.js', gulp.series(scripts, readyReload));
	gulp.watch('src/pages/**/*.pug', gulp.series(pug2html, readyReload));

	gulp.watch('package.json', gulp.series(copyDependencies, readyReload));

	return cb();
};
