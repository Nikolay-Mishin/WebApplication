const {
	lastRun,
	config: { paths },
	modules: {
		gulp: { src, dest },
		sourcemaps, rename, concat, babel, terser, gulpTerser
	}
} = require('./helpers/helpers');

module.exports = function scripts() {
	return src(paths.src.js, lastRun(scripts))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}).on('error', babel.logError))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(paths.build.js))
		//.pipe(gulpTerser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulpTerser({}, terser.minify))
		.pipe(dest(paths.build.js));
};
