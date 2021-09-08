import h from './helpers/helpers.js';
const {
	lastRun,
	config: { paths },
	modules: {
		gulp: { src, dest },
		pug
	}
} = h;

export default function dev_pug() {
	return src(paths.src.pug, lastRun(dev_pug))
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.build.root));
};
