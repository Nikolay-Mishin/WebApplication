const {
	config: { paths },
	modules: { rimraf }
} = require('./helpers');

module.exports = function clean(done) { rimraf(paths.clean.build, done); };
