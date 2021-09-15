import h from './helpers/helpers.js';
const {
	config: { paths: { build: { faviconDataFile } } },
	modules: {
		fs: { readFileSync: readFile },
		realFavicon: { checkForUpdates }
	}
} = h;

export default async () => checkForUpdates(JSON.parse(readFile(faviconDataFile)).version, err => { if (err) throw err; })
