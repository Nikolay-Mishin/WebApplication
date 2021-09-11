const h = require('./helpers/helpers'),
	{
		lastRun, notify,
		args: { fav },
		config: { paths },
		modules: {
			gulp: { src, dest },
			fs: { readFileSync: readFile },
			reload, stream, _if, sourcemaps, htmlclean, htmlmin, realFavicon: { injectFaviconMarkups }
		}
	} = h;

module.exports = function html() {
	const { dev, prod, mode } = h;
	return src(paths.src.html, lastRun(html))
		.pipe(_if(dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(_if(dev && fav, injectFaviconMarkups(JSON.parse(readFile(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(_if(dev, htmlclean()))
		.pipe(_if(prod, htmlmin({ collapseWhitespace: true })))
		.pipe(_if(dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.html))
		.pipe(notify(`${mode}:html`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
