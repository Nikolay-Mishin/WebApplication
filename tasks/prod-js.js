const {
	lastRun, error, notify,
	config: { paths },
	modules: {
		gulp: { src, dest },
		reload, stream, rigger, uglify
	}
} = require('./helpers/helpers');

module.exports = function prod_js() {
	return src(paths.src.js, lastRun(dev_js)) // main файл
		.pipe(rigger()) // rigger
		.pipe(uglify().on('error', error)) // сжатие js
		.pipe(dest(paths.build.js)) // готовый файл min в build
		.pipe(notify('prod:js'));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(stream());
};
