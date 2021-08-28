// <binding AfterBuild='build' ProjectOpened='watch:webpack' />
//'use strict';

// Подключаемые плагины

const config = require('./gulpfile.config'),
	path = require('path'), // path
	{ src, dest, watch, lastRun, series, parallel } = require('gulp'), // сам gulp
	gulp = require('gulp'), // сам gulp
	browserSync = require("browser-sync"), // плагин перезагрузки браузера
	reload = browserSync.reload,
	rimraf = require('rimraf'),// удаление файлов
	pug = require('gulp-pug'), // плагин компиляции pug
	sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	prefixer = require('gulp-autoprefixer'), // плагин расстановки префиксов
	sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	rename = require('gulp-rename'), // плагин переименования файлов
	htmlmin = require('gulp-htmlmin'), // плагин сжатия html
	inlineCss = require('gulp-inline-css'),
	rigger = require('gulp-rigger'), // плагин объединения js
	uglify = require('gulp-uglify'), // плагин сжатия js
	notify = require('gulp-notify'), // отладка
	plumber = require('gulp-plumber'), // отладка
	gutil = require('gulp-util'), // отладка
	gulpif = require('gulp-if'), // плагин для условий
	realFavicon = require('gulp-real-favicon'), // генератор фавиконок
	imagemin = require('gulp-imagemin'), // оптимизация картинок
	ImgMinify = require('imgminify'), // оптимизация картинок
	fs = require('fs'), // работа с файловой системой 
	htmlclean = require('gulp-htmlclean'),
	webpack = require('webpack'), // webpack
	webpackStream = require('webpack-stream'), // webpack
	webpackConfig = require('./webpack.config.js'), // webpack.config
	babel = require('gulp-babel'),
	terser = require('terser'),
	gulpTerser = require('gulp-terser');

// Переменные проекта

const { paths, serverConfig, site } = config;
	//build = './wwwroot/',
	//src_path = './src/',
	//paths = {
	//	build: { // пути для сборки проектов
	//		all: build,
	//		html: build + 'html/',
	//		css: build + 'css/',
	//		js: build + 'js/', 
	//		favicon: build + 'favicon/',
	//		faviconDataFile: src_path + 'favicon/faviconData.json',
	//		faviconInject: build + '**/*.html',
	//		img: build + 'img/'
	//	},
	//	src: { // пути размещения исходных файлов проекта
	//		all: src_path,
	//		html: src_path + 'html/**/*.{html,htm}',
	//		pug: src_path + 'pug/*.pug',
	//		scss: src_path + 'scss/*.scss',
	//		js: src_path + 'js/*.{js,js.map}',
	//		webpack: src_path + 'js/**/*.js',
	//		favicon: src_path + 'favicon/icon.png',
	//		iconsPath: '/favicon',
	//		img: src_path + 'img/**/*.{jpeg,jpg,png,svg,gif}'
	//	},
	//	watch: { // пути файлов, за изменением которых мы хотим наблюдать
	//		html: src_path + 'html/**/*.{html,htm}',
	//		scss: src_path + 'scss/**/*.scss',
	//		js: src_path + 'js/**/*.js'
	//	},
	//	clean: { // путь очистки директории для сборки
	//		build: build + '**/*',
	//		html: build + 'html',
	//		css: build + 'css',
	//		js: build + 'js',
	//		webpack: build + 'webpack'
	//	}
	//},
	//// конфигурация browser sync
	//serverConfig = {
	//	server: {
	//		baseDir: build,
	//		index: 'index.html'
	//	},
	//	tunnel: true,
	//	host: 'localhost',
	//	port: 7787,
	//	logPrefix: "WebDev"
	//},
	//site = {
	//	server: 'site.ru',
	//	user: 'tstv',
	//	pass: '112121',
	//	port: '10000',
	//	folder: ''
	//};

gulp.task('clean', function(done) {
	rimraf(paths.clean.build, done);
});

gulp.task('clean:html', function(done) {
	rimraf(paths.clean.html, done);
});

gulp.task('clean:js', function(done) {
	rimraf(paths.clean.js, done);
});

gulp.task('clean:webpack', function(done) {
	rimraf(paths.clean.webpack, done);
});

gulp.task('build:html', function(done) {
	gulp.src(paths.src.html)
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(htmlclean())
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(gulp.dest(paths.build.html));
	done();
});

gulp.task('build:js', function(done) {
	gulp.src(paths.src.js)
		.pipe(gulp.dest(paths.build.js))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify().on('error', getError))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(paths.build.js))
		.pipe(getNotify('build:js'));
	done();
});

gulp.task('scripts', function(done) {
	gulp.src(paths.src.js)
		.pipe(sourcemaps.init())
		.pipe(babel({
			//presets: ['env']
			presets: ['@babel/preset-env']
		}).on('error', babel.logError))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.build.js))
		//.pipe(gulpTerser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulpTerser({}, terser.minify))
		.pipe(gulp.dest(paths.build.js));
	done();
});

gulp.task('build:webpack', function(done) {
	gulp.src(paths.src.all)
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.build.js))
		.pipe(getNotify('build:webpack'));
	done();
});

function getError(err) {
	gutil.log(gutil.colors.red('[Error]'), err.toString());
}

function getNotify(title, message = 'Scripts Done') {
	return notify({
		title: title,
		message: message
	});
}

// Отслеживание изменений в проекте

gulp.task('watch:webpack', function(done) {
	//gulp.watch(paths.watch.js, gulp.series('build'));
	gulp.watch(paths.watch.js);
	done();
});

// Execution

gulp.task('html', gulp.series('clean:html', 'build:html'));
gulp.task('js', gulp.series('clean:js', 'build:js'));
gulp.task('webpack', gulp.series('clean:webpack', 'build:webpack'));

gulp.task('build:all', gulp.series('html', gulp.parallel('webpack')));
gulp.task('build', gulp.series('clean', gulp.parallel('build:html', 'build:webpack')));
//gulp.task('build', gulp.series('build:webpack'));

// задача по умолчанию

gulp.task('default', gulp.series('build'));

// Основные Задачи

gulp.task('move:test', function(done) {
	gulp.src('src/**/*')
		.on('data', function(file) {
			console.log({
				contents: file.contents, // содержимое файла
				path: file.paths, // путь до файла
				cwd: file.cwd, // основная директория
				base: file.base, // базовая директория
				// helpers
				relative: file.relative, // имя файла относительно текущей директории
				dirname: file.dirname, // имя текущей директории
				basename: file.basename, // название файла
				stem: file.stem, // имя файла
				extname: file.extname // расширение файла
			});
		})
		.pipe(gulp.dest(function(file) {
			return file.extname == '.html' ? 'files/html' :
				file.extname == '.css' ? 'files/css' :
					file.extname == '.js' ? 'files/js' : 'files'
		}));
	done();
});

gulp.task('move:files', function(done) {
	gulp.src('files/**/*.{html,htm}').pipe(gulp.dest(paths.build.all));
	gulp.src('files/**/*.pug').pipe(gulp.dest(paths.build.pug));
	gulp.src('files/**/*.css').pipe(gulp.dest(paths.build.css));
	gulp.src('files/**/*.js').pipe(gulp.dest(paths.build.js));
	gulp.src('files/assets/**/*.{jpeg,jpg,png,svg,gif}').pipe(gulp.dest(paths.build.img));
	done();
});

gulp.task('move', gulp.series('clean', 'move:files'));

/**********************
 * check cmd arguments
 ***********************/

const arg = (argList => {
	let arg = {}, a, opt, thisOpt, curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');

		if (opt === thisOpt) {
			// argument value
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;
		}
		else {
			// argument name
			curOpt = opt;
			arg[curOpt] = true;
		}
	}
	return arg;
})(process.argv);

gulp.task('args', function(done) {
	console.log(arg);
	done();
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: paths.src.favicon,
		dest: paths.build.favicon,
		iconsPath: paths.src.iconsPath,
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '39%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'whiteSilhouette',
				backgroundColor: '#00aba9',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'shadow',
				themeColor: '#ffffff',
				manifest: {
					name: 'Barcode',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false
		},
		markupFile: paths.build.faviconDataFile
	},
		function() {
			done();
		});
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

/* *******************************
	* Development Tasks
********************************** */

// Очистка дериктории для компиляции

//gulp.task('clean', function(done) {
//	rimraf(paths.clean.build, done);
//});

gulp.task('dev:html', function(done) {
	gulp.src(paths.src.html)
		.pipe(gulpif(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(gulp.dest(paths.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:pug', function(done) {
	gulp.src(paths.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(paths.build.all));
	done();
});

gulp.task('dev:scss', function(done) {
	gulp.src(paths.src.scss) // main файл
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
		.pipe(gulp.dest(paths.build.css)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:js', function(done) {
	gulp.src(paths.src.js) // main файл
		.pipe(rigger()) // rigger
		.pipe(gulp.dest(paths.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(gulp.dest(paths.build.js)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

let imgminify = new ImgMinify()
	.src(paths.src.img)
	.dest(paths.build.img)
	.use(ImgMinify.gifsicle({ interlaced: true }))
	.use(ImgMinify.jpegoptim({ progressive: true, max: 60 }))
	.use(ImgMinify.jpegtran({ progressive: true }))
	.use(ImgMinify.optipng({ optimizationLevel: 3 }))
	.use(ImgMinify.pngquant({ speed: 1 }))
	.use(ImgMinify.svgo());

gulp.task('dev:img', function(done) {
	imgminify.run(function(err, files) {
		if (err) {
			throw err;
		}
		console.log('Files optimized successfully!');
	});
	done();
});

gulp.task('dev:imgmin', function(done) {
	gulp.src(paths.src.img)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{ removeViewBox: true }]
		}))
		.pipe(gulp.dest(paths.build.img));
	done();
});

/* Webserver */

gulp.task('webserver', function(done) {
	browserSync(serverConfig); // локальный сервер
	done();
});

/* *******************************
	* Production Tasks
********************************** */

gulp.task('sftp:push', function(done) {
	gulp.src(paths.build.all)
		.pipe(sftp({
			host: site.server,
			user: site.user,
			pass: site.pass,
			port: site.port,
			remotePath: site.folder
		}));
	done();
});

gulp.task('prod:html', function(done) {
	gulp.src(paths.src.html)
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(paths.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('prod:scss', function(done) {
	gulp.src(paths.src.scss)
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(gulp.dest(paths.build.css));
	done();
});

gulp.task('prod:js', function(done) {
	gulp.src(paths.src.js)
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify()) // минификация
		.pipe(gulp.dest(paths.build.js));
	done();
});

// Отслеживание изменений в проекте

gulp.task('watch', function(done) {
	gulp.watch(paths.watch.html, gulp.series('dev:html'), reload({ stream: true }));
	gulp.watch(paths.watch.scss, gulp.series('dev:scss'), reload({ stream: true }));
	gulp.watch(paths.watch.js, gulp.series('dev:js'), reload({ stream: true }));
	done();
});

// Execution

gulp.task('dev', gulp.series('clean', gulp.parallel('dev:scss', 'dev:js', 'dev:img'/* , 'generate-favicon' */), 'dev:html', 'webserver', 'watch'));

gulp.task('prod', gulp.series('clean', gulp.parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

// задача по умолчанию
gulp.task('build:dev', gulp.series('dev'));
