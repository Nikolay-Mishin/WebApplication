const {
	config: { paths },
	modules: { fs, realFavicon }
} = require('./helpers/helpers');

module.exports = async function check_for_favicon_update() {
	let currentVersion = JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).version;
	realFavicon.checkForUpdates(currentVersion, err => { if (err) throw err; });
};
