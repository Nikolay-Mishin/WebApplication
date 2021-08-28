const { paths } = require('../gulpfile.config'),
	rimraf = require('rimraf'); // удаление файлов

module.exports = function clean_js(done) {
	rimraf(paths.clean.js, done);
};
