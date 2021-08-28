const { paths } = require('../gulpfile.config'),
	rimraf = require('rimraf'); // удаление файлов

module.exports = function clean_html(done) {
	rimraf(paths.clean.html, done);
};
