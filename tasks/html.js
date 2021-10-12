import h from './helpers/helpers.js';
const {
		lastRun, notify,
		args: { fav },
		config: { paths },
		modules: {
			gulp: { src, dest },
			fs: { readFileSync: readFile },
			reload, stream, $if, sourcemaps, htmlclean, htmlmin, realFavicon: { injectFaviconMarkups }
		}
	} = h;

export default function html() {
	const { dev, prod, mode } = h;
	return src(paths.src.html, lastRun(html))
		.pipe($if(dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe($if(dev && fav, injectFaviconMarkups(JSON.parse(readFile(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe($if(dev, htmlclean()))
		.pipe($if(prod, htmlmin({ collapseWhitespace: true })))
		.pipe($if(dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.html))
		.pipe(notify(`${mode}:html`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
}
