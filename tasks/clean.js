const { paths } = require('../gulpfile.config'),
	rimraf = require('rimraf'); // удаление файлов

module.exports = function clean(done) {
	return rimraf(paths.clean.build, done);
};
