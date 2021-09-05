const {
	config: { paths },
	modules: { rimraf }
} = require('./helpers');

module.exports = function clean_html(done) { rimraf(paths.clean.html, done); };
