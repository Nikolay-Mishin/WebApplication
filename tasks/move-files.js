import h from './helpers/helpers.js';
const {
	lastRun,
	config: { paths },
	modules: {
		gulp: { src, dest },
		realFavicon
	}
} = h;

export default function move_files() {
	src('files/**/*.{html,htm}', lastRun(move_files)).pipe(dest(paths.build.root));
	src('files/**/*.pug', lastRun(move_files)).pipe(dest(paths.build.pug));
	src('files/**/*.css', lastRun(move_files)).pipe(dest(paths.build.css));
	src('files/**/*.js', lastRun(move_files)).pipe(dest(paths.build.js));
	return src('files/assets/**/*.{jpeg,jpg,png,svg,gif}', lastRun(move_files)).pipe(dest(paths.build.img));
};
