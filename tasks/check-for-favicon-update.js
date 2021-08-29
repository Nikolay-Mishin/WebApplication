const fs = require('fs'), // работа с файловой системой
	{ paths } = require('../gulpfile.config'),
	realFavicon = require('gulp-real-favicon'); // генератор фавиконок

module.exports = function check_for_favicon_update(done) {
	let currentVersion = JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).version;
	realFavicon.checkForUpdates(currentVersion, err => { if (err) throw err; });
	done();
};
