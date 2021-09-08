import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: {
		fs: { readFileSync: readFile },
		realFavicon: { checkForUpdates }
	}
} = h;

export default async function check_for_favicon_update() {
	let currentVersion = JSON.parse(readFile(paths.build.faviconDataFile)).version;
	checkForUpdates(currentVersion, err => { if (err) throw err; });
};
