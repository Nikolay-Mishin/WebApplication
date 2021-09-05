const {
	lastRun,
	config: { paths },
	modules: {
		gulp: { src, dest },
		imageMin
	}
} = require('./helpers/helpers');

module.exports = function dev_imgmin() {
	return src(paths.src.img, lastRun(dev_imgmin))
		.pipe(imageMin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{ removeViewBox: true }]
		}))
		.pipe(dest(paths.build.img));
};
