const {
	lastRun, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		reload, stream
	}
} = require('./helpers/helpers');

module.exports = function php() {
	return src(paths.src.php, lastRun(php))
		.pipe(dest(paths.build.html))
		.pipe(notify(`${h.mode}:php`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
