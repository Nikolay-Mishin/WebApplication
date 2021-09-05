const {
	config: { paths },
	modules: { rimraf }
} = require('./helpers/helpers');

module.exports = function clean(done) { rimraf(paths.clean.build, done); };
