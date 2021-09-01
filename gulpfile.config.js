const { join } = require('path'),
	root = __dirname,
	build = join(root, 'build'),
	src = join(root, 'src'),
	port = process.env.PORT || 8080,
	customDomain = process.env.DEV_DOMAIN ? process.env.DEV_DOMAIN : 'localhost'; // environment: process.env

module.exports = {
	// Подключаемые модули
	//modules: {
	//	gulp: require('gulp'), // сам gulp
	//	fs: require('fs'), // работа с файловой системой
	//	browserSync: require('browser-sync'), // плагин перезагрузки браузера
	//	reload: browserSync.reload,
	//	server: browserSync.create(),
	//	stream: server.stream,
	//	gulpif: require('gulp-if'), // плагин для условий
	//	gutil: require('gulp-util'), // отладка
	//	notify: require('gulp-notify'), // отладка
	//	plumber: require('gulp-plumber'), // отладка
	//	rimraf: require('rimraf'), // удаление файлов
	//	rename: require('gulp-rename'), // плагин переименования файлов
	//	sourcemaps: require('gulp-sourcemaps'), // плагин создания map-файлов
	//	htmlmin: require('gulp-htmlmin'), // плагин сжатия html
	//	htmlclean: require('gulp-htmlclean'),
	//	pug: require('gulp-pug'), // плагин компиляции pug
	//	inlineCss: require('gulp-inline-css'),
	//	sass: require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	//	prefixer: require('gulp-autoprefixer'), // плагин расстановки префиксов
	//	rigger: require('gulp-rigger'), // плагин объединения js
	//	concat: require('concat'),
	//	uglify: require('gulp-uglify'), // плагин сжатия js
	//	webpack: require('webpack'), // webpack
	//	webpackStream: require('webpack-stream'), // webpack
	//	webpackConfig: require('./webpack.config'), // webpack.config
	//	babel: require('gulp-babel'),
	//	terser: require('terser'),
	//	gulpTerser: require('gulp-terser'),
	//	realFavicon: require('gulp-real-favicon'), // генератор фавиконок
	//	imageMin: require('gulp-imagemin'), // оптимизация картинок
	//	imgMinify: require('imgminify') // оптимизация картинок
	//},
	root,
	build,
	src,
	tasksPath: join(root, 'tasks'),
	webpackConfig: join(root, 'webpack.config'), // webpack.config
	jsModule: 'es6',
	paths: {
		build: { // пути для сборки проектов
			all: build,
			html: join(build, 'html/'),
			css: join(build, 'css/'),
			js: join(build, 'js/'),
			favicon: join(build, 'favicon/'),
			faviconDataFile: join(src, 'favicon/faviconData.json'),
			faviconInject: join(build, '**/*.html'),
			img: join(build, 'img/')
		},
		src: { // пути размещения исходных файлов проекта
			all: src,
			html: join(src, 'html/**/*.{html,htm}'),
			pug: join(src, 'pug/*.pug'),
			scss: join(src, 'scss/*.{scss,sass}'),
			js: join(src, 'js/*.{js,js.map}'),
			webpack: join(src, 'js/**/*.js'),
			favicon: join(src, 'favicon/icon.png'),
			iconsPath: '/favicon',
			img: join(src, 'img/**/*.{jpeg,jpg,png,svg,gif}')
		},
		watch: { // пути файлов, за изменением которых мы хотим наблюдать
			html: join(src, 'html/**/*.{html,htm}'),
			scss: join(src, 'scss/**/*.scss'),
			js: join(src, 'js/**/*.js')
		},
		clean: { // путь очистки директории для сборки
			build: join(build, '**/*'),
			html: join(build, 'html'),
			css: join(build, 'css'),
			js: join(build, 'js')
		}
	},
	// конфигурация browserSync
	serverConfig: {
		server: {
			baseDir: build,
			index: 'index.html'
		},
		tunnel: true,
		proxy: `localhost:${port}`,
		open: false,
		host: customDomain,
		port: 3000, // 7787
		logPrefix: "WebDev",
		//ghostMode: false, /* don't mirror interactions in other browsers */
		//snippetOptions: {
		//	rule: {
		//		match: /<\/body>/i,
		//		fn: snippet:> snippet,
		//	},
		//},
	},
	site: {
		host: 'site.ru',
		user: 'tstv',
		pass: '112121',
		port: '10000',
		folder: ''
	}
};
