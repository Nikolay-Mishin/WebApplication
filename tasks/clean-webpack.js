const { paths } = require('../gulpfile.config'),
	rimraf = require('rimraf'); // удаление файлов

module.exports = function clean_webpack(done) {
	rimraf(paths.clean.webpack, done);
};
