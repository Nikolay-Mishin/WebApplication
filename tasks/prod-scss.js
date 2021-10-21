import h from './helpers/helpers.js';
const {
	lastRun, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		$reload, stream, sass, prefixer
	}
} = h;

export default function prod_scss() {
	return src(paths.src.scss, lastRun(prod_scss))
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(dest(paths.build.css))
		.pipe(notify('prod:scss'));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
