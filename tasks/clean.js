import h from './helpers/helpers.js';
const {
	config: { paths },
	modules: { rimraf }
} = h;

export default function clean(done) { rimraf(paths.clean.build, done); };
