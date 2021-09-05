const {
	lastRun, notify,
	arg: { fav },
	config: { paths },
	modules: {
		gulp: { src, dest },
		reload, stream, _if, sourcemaps, htmlclean, realFavicon
	}
} = require('./helpers/helpers');

module.exports = function dev_html() {
	return src(paths.src.html, lastRun(dev_html))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(_if(fav, realFavicon.injectFaviconMarkups(
			JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code
		)))
		.pipe(htmlclean())
		.pipe(dest(paths.build.root))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(notify('dev:html'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
