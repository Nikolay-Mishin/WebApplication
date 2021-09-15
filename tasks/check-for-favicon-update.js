const {
	config: { paths: { build: { faviconDataFile } } },
	modules: {
		fs: { readFileSync: readFile },
		realFavicon: { checkForUpdates }
	}
} = require('./helpers/helpers');

module.exports = async () => checkForUpdates(JSON.parse(readFile(faviconDataFile)).version, err => { if (err) throw err; });
