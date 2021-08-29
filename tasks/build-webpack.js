const { src, dest } = require('gulp'),
	{ paths, webpackConfig } = require('../gulpfile.config'),
	{ notify } = require('./_helpers'),
	webpack = require('webpack'), // webpack
	webpackStream = require('webpack-stream'); // webpack stream

module.exports = function build_webpack() {
	return src(paths.src.all)
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(dest(paths.build.js))
		.pipe(notify('build:webpack'));
};