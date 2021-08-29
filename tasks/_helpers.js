const server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'), // отладка
	ImgMinify = require('imgminify'); // оптимизация картинок

module.exports = {
	readyReload: function readyReload(done) {
		server.reload();
		done();
	},
	error: function(err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	},
	notify: function(title, message = 'Scripts Done') {
		return notify({
			title: title,
			message: message
		});
	},
	arg: (argList => {
		let arg = {}, a, opt, thisOpt, curOpt;
		for (a = 0; a < argList.length; a++) {
			thisOpt = argList[a].trim();
			opt = thisOpt.replace(/^\-+/, '');

			if (opt === thisOpt) {
				// argument value
				if (curOpt) arg[curOpt] = opt;
				curOpt = null;
			}
			else {
				// argument name
				curOpt = opt;
				arg[curOpt] = true;
			}
		}
		return arg;
	})(process.argv),
	imgMinify: new ImgMinify()
		.src(paths.src.img)
		.dest(paths.build.img)
		.use(ImgMinify.gifsicle({ interlaced: true }))
		.use(ImgMinify.jpegoptim({ progressive: true, max: 60 }))
		.use(ImgMinify.jpegtran({ progressive: true }))
		.use(ImgMinify.optipng({ optimizationLevel: 3 }))
		.use(ImgMinify.pngquant({ speed: 1 }))
		.use(ImgMinify.svgo())
};
