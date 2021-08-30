const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun/*, server*/ } = require('./helpers/helpers'),
	reload = require('browser-sync').reload, // плагин перезагрузки браузера
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	prefixer = require('gulp-autoprefixer'); // плагин расстановки префиксов

module.exports = function scss() {
	return src(paths.src.scss, lastRun(dev_scss)) // main файл
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(sass({
			outputStyle: 'compressed', // минимиация файла
			sourcemaps: true
		}
		).on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['> 1%'], // last 5 versions
			cascade: false, // запрет на разворот кода
			remove: true // удаление лишних стилей при обработке
		}))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.css)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());

	return src(paths.src.scss, lastRun(prod_scss))
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(dest(paths.build.css))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
		//.pipe(server.stream());
};
