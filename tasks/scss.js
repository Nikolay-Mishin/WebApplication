const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	h = require('./helpers/helpers'),
	{ lastRun, notify } = h,
	//reload = require('browser-sync').reload, // плагин перезагрузки браузера
	_if = require('gulp-if'), // плагин для условий
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	prefixer = require('gulp-autoprefixer'); // плагин расстановки префиксов

module.exports = function scss() {
	return src(paths.src.scss, lastRun(scss)) // main файл
		.pipe(_if(h.dev, sourcemaps.init())) // Инициализируем sourcemap
		.pipe(sass({
			outputStyle: 'compressed', // минимиация файла
			sourcemaps: h.dev
		}).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'], // last 5 versions
			cascade: false, // запрет на разворот кода
			remove: true // удаление лишних стилей при обработке
		}))
		.pipe(_if(h.dev, sourcemaps.write('.'))) // Пропишем карты
		.pipe(dest(paths.build.css)) // готовый файл min в build
		.pipe(notify(`${h.mode}:scss`));
		//.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
