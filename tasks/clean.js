const {
	config: { paths },
	modules: { rimraf }
} = require('./helpers/helpers');

module.exports = done => rimraf(paths.clean.build, done);
