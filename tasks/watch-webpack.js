const { paths } = require('../gulpfile.config'),
	{ watch, series } = require('gulp');

module.exports = function watch_webpack(done) {
	//watch(paths.watch.js, series('build'));
	watch(paths.watch.js);
	done();
};
