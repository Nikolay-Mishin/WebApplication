const gulp = require('gulp');

const server = require('./gulp/tasks/server'),
	pug2html = require('./gulp/tasks/pug2html'),
	styles = require('./gulp/tasks/styles'),
	scripts = require('./gulp/tasks/scripts'),
	fonts = require('./gulp/tasks/fonts'),
	imageMinify = require('./gulp/tasks/imageMinify'),
	clean = require('./gulp/tasks/clean'),
	copyDependencies = require('./gulp/tasks/copyDependencies'),
	lighthouse = require('./gulp/tasks/lighthouse'),
	svgSprite = require('./gulp/tasks/svgSprite');

function setMode(isProd = false) {
	return cb => {
		process.env.NODE_ENV = isProd ? 'production' : 'development';
		cb();
	};
}

const dev = gulp.parallel(pug2html, styles, scripts, fonts, imageMinify, svgSprite),
	build = gulp.series(clean, copyDependencies, dev);

module.exports.start = gulp.series(setMode(), build, server);
module.exports.build = gulp.series(setMode(true), build);

module.exports.lighthouse = gulp.series(lighthouse);
