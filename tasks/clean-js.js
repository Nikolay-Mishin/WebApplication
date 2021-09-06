import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: { rimraf }
} = h;

export default function clean_js(done) { rimraf(paths.clean.js, done); };
