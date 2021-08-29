const { series, parallel } = require('gulp'),
	{ setMode } = require('./tasks/_helpers');

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

const build = series(clean, copyDependencies, parallel(pug2html, styles, scripts, fonts, imageMinify, svgSprite));

exports.start = series(setMode(), build, server);
exports.build = series(setMode(true), build);
exports.lighthouse = series(lighthouse);
