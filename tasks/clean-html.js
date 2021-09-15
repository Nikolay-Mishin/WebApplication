import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: { rimraf }
} = h;

export default done => rimraf(paths.clean.html, done)
