const {
	lastRun,
	config: { paths },
	modules: {
		gulp: { src, dest },
		pug
	}
} = require('./helpers/helpers');

module.exports = function dev_pug() {
	return src(paths.src.pug, lastRun(dev_pug))
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.build.root));
};
