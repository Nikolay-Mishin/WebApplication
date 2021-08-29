const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun } = require('./_helpers'),
	imageMin = require('gulp-imagemin'); // оптимизация картинок

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
