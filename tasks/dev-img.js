const { paths } = require('../gulpfile.config'),
	{ lastRun } = require('./helpers/helpers'),
	ImgMinify = require('imgminify'); // оптимизация картинок;

const imgMinify = (function imgMinify() {
	return new ImgMinify()
		.src(paths.src.img, lastRun(imgMinify))
		.dest(paths.build.img)
		.use(ImgMinify.gifsicle({ interlaced: true }))
		.use(ImgMinify.jpegoptim({ progressive: true, max: 60 }))
		.use(ImgMinify.jpegtran({ progressive: true }))
		.use(ImgMinify.optipng({ optimizationLevel: 3 }))
		.use(ImgMinify.pngquant({ speed: 1 }))
		.use(ImgMinify.svgo());
})();

module.exports = function dev_img(done) {
	imgMinify.run(function(err, files) {
		if (err) throw err;
		console.log('Images optimized successfully!');
	});
	done();
};
