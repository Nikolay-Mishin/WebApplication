import h from './helpers/helpers.js';
const {
	config: { paths: { build: { faviconDataFile } } },
	modules: {
		fs: { readFileSync: read },
		realFavicon: { checkForUpdates }
	}
} = h;

export default async () => checkForUpdates(JSON.parse(read(faviconDataFile)).version, err => { if (err) throw err; })
