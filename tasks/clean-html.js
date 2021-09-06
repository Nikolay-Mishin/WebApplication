import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: { rimraf }
} = h;

export default function clean_html(done) { rimraf(paths.clean.html, done); };
