const { src, dest, watch, series, parallel/*, lastRun*/ } = require('gulp'),
	{ lastRun } = require('./_helpers'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(), // сервер + перезагрузка 
	babel = require('gulp-babel'),                  // для работы с JS 
	concat = require('gulp-concat'),                // объединение файлов в один
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	rSync = require('gulp-rsync');

exports.clean = require('./tasks/clean');

function html() {
	return src('app/**/*.html', lastRun(html))
		.pipe(dest('dist/'))         // перенос HTML в папку деплоя
		.pipe(browserSync.stream()); // обновление страницы
}
exports.html = html;

/* outputStyle */
//expanded - полностью развёрнутый CSS;
//nested - показывает вложенность(по умолчанию);
//compact - каждый селектор на новой строке;
//compressed - всё в одну строку.
function Sass() {
	return src('app/assets/sass/**/*.sass', lastRun(Sass))
		.pipe(sourcemaps.init())       // активируем gulp-sourcemaps
		.pipe(sass({
			outputStyle: 'nested'      // вложенный (по умолчанию)
		}).on('error', sass.logError)) // уведомление об ошибках
		.pipe(sourcemaps.write('.'))   // создание карты css.map в текущей папке
		.pipe(dest('app/assets/css/'))
		.pipe(dest('dist/assets/css/'))
		.pipe(browserSync.stream());
}
exports.sass = Sass;

function scripts() {
	return src([
		'app/assets/js/script_1.js',
		'app/assets/js/script_2.js',
		'app/assets/js/main.js'
	], lastRun(scripts))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write("."))
		.pipe(dest('app/assets/js/'))
		.pipe(dest('dist/assets/js/'))
		.pipe(browserSync.stream());
}
exports.scripts = scripts;

function images() {
	return src('app/assets/images/**/*.jpg', { since: lastRun(images) })
		.pipe(imagemin())
		.pipe(dest('dist/assets/img/'));
}
exports.images = images;

// Если вы ведете разработку, для CMS, например, WordPress, то вам вместо 'server' необходимо использовать 'proxy'
function server() {
	browserSync.init({
		server: {
			baseDir: 'app' // здесь указываем корневую папку для локального сервера
		},
		//proxy: 'http://only-to-top.loc/'
		notify: false      // отключаем уведомления
	});

	watch('app/**/*.html', { usePolling: true }, html);             // следим за HTML
	watch('app/assets/sass/**/*.sass', { usePolling: true }, Sass); // следим за SASS
	watch('app/assets/js/**/*.js', { usePolling: true }, scripts);  // следим за JS
	watch('app/assets/images/**/*.jpg', images);
}

// Удаление папки «dist» 
function clean() {
	return del('./dist/');
}
exports.clean = clean;

const { clean } = exports;
exports.default = series(
	clean,
	parallel(html, Sass, scripts, images),
	server
);

//root - выбор папки для деплоя
//hostname - ваш SSH - логин @ip или адрес вашего сайта(например, user2583@sitename.ru)
//destination - выбор папки на хостинге, куда будет загружаться сайт
//port - эта строчка нужна лишь в том случае, если для SSH доступа нужен нестандартный порт(например, 25212)
//include - какие файлы включать для переноса на хостинг
//exclude - какие файлы не включать
//recursive: true - рекурсивно передавать все файлы и каталоги
//archive: true - режим архива
//silent: false - отключение ведения журнала
//compress: true - сжатие данных во время передачи
function rs() {
	return gulp.src('site/**')
		.pipe(rSync({
			root: 'site/**',
			hostname: 'yourLogin@yourIp',
			destination: 'sitePath',
			port: 25212,
			include: ['*.htaccess'],
			exclude: ['**/Thumbs.db', '**/*.DS_Store'],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
}

exports.deploy = series(
	parallel(html, Sass, scripts),
	rs
);
