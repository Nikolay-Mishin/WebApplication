const { src, dest } = require('gulp'),
	{ paths, webpackConfig } = require('../gulpfile.config'),
	{ lastRun, notify } = require('./helpers/helpers'),
	webpack = require('webpack'), // webpack
	webpackStream = require('webpack-stream'); // webpack stream

module.exports = function build_webpack() {
	return src(paths.src.all, lastRun(build_webpack))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(dest(paths.build.js))
		.pipe(notify('build:webpack'));
};
