const {
	config: { paths },
	modules: { rimraf }
} = require('./helpers');

module.exports = function clean_js(done) { rimraf(paths.clean.js, done); };
