const {
	lastRun, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		reload, stream, htmlmin, realFavicon
	}
} = require('./helpers/helpers');

module.exports = function prod_html() {
	return src(paths.src.html, lastRun(prod_html))
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(paths.build.root))
		.pipe(notify('prod:html'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
