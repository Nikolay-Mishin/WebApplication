import { log } from 'console';
import h from './helpers/helpers.js';
const {
		lastRun,
		config: { paths },
		modules: { ImgMinify }
	} = h;

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

export default async function dev_img() {
	imgMinify.run(function(err, files) {
		if (err) throw err;
		log('Images optimized successfully!');
	});
};
