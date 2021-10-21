import h from './helpers/helpers.js';
const {
	lastRun, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		fs: { readFileSync: read },
		$reload, stream, htmlmin, realFavicon: { injectFaviconMarkups }
	}
} = h;

export default function prod_html() {
	return src(paths.src.html, lastRun(prod_html))
		.pipe(injectFaviconMarkups(JSON.parse(read(paths.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(paths.build.root))
		.pipe(notify('prod:html'));
		//.pipe($reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
