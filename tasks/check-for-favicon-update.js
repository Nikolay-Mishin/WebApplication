const {
	config: { paths },
	modules: {
		fs: { readFileSync: readFile },
		realFavicon: { checkForUpdates }
	}
} = require('./helpers/helpers');

module.exports = async function check_for_favicon_update() {
	let currentVersion = JSON.parse(readFile(paths.build.faviconDataFile)).version;
	checkForUpdates(currentVersion, err => { if (err) throw err; });
};
