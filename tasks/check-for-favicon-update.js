import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: { fs, realFavicon }
} = h;

export default async function check_for_favicon_update() {
	let currentVersion = JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).version;
	realFavicon.checkForUpdates(currentVersion, err => { if (err) throw err; });
};
