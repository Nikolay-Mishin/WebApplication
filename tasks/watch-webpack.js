const { watch, series } = require('gulp'),
	{ paths } = require('../gulpfile.config');

module.exports = function watch_webpack(done) {
	//watch(paths.watch.js, series('build'));
	return watch(paths.watch.js);
	//done();
};