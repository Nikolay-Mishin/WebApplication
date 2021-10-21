import h from './helpers/helpers.js';
const {
	lastRun, notify,
	args: { fav },
	config: { paths },
	modules: {
		gulp: { src, dest },
		fs: { readFileSync: read },
		$reload, stream, $if, sourcemaps, htmlclean, realFavicon: { injectFaviconMarkups }
	}
} = h;

export default function dev_html() {
	return src(paths.src.html, lastRun(dev_html))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe($if(fav, injectFaviconMarkups(JSON.parse(read(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(htmlclean())
		.pipe(dest(paths.build.root))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(notify('dev:html'));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
