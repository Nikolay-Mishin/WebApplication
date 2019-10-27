/// <binding BeforeBuild='clean:root' AfterBuild='default' />
'use strict';

// global (-g)
// npm i -g gulp-cli

// devDependencies (-D | --save-dev)
// npm i -D babel-core babel-loader@7 babel-preset-env babel-preset-latest browser-sync commonjs gulp gulp-autoprefixer gulp-changed gulp-clean gulp-cli gulp-commonjs gulp-concat gulp-cssmin gulp-htmlclean gulp-htmlmin gulp-if gulp-imagemin gulp-inline-css gulp-less gulp-notify gulp-plumber gulp-pug gulp-real-favicon gulp-rename gulp-rigger gulp-sass gulp-sourcemaps gulp-typescript gulp-uglify gulp-util gulp-watch imgminify less-plugin-lists rimraf tslib typescript webpack webpack-stream

// devDependencies (-S | --save)
// npm i -S animate.css bootstrap clipboard fancybox jquery jquery-modal jquery.maskedinput

// Uninstall
// npm -g uninstall <name> --save also removes it globally
// npm uninstall <name> removes the module from node_modules, but not package.json
// npm uninstall <name> --save also removes it from dependencies in package.json
// npm uninstall <name> --save-dev also removes it from devDependencies in package.json

// Подключаемые плагины

const gulp = require('gulp'), // сам gulp 
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
	gulpif = require('gulp-if'), // плагин для условий
	realFavicon = require('gulp-real-favicon'), // генератор фавиконок
	imagemin = require('gulp-imagemin'), // оптимизация картинок
	ImgMinify = require('imgminify'),
	fs = require('fs'), // работа с файловой системой 
	htmlclean = require('gulp-htmlclean'),
	//gulpCommonJS = require('gulp-commonjs'),
	//ts = require('gulp-typescript'),
	//tsProject = ts.createProject('tsconfig.json'),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	webpackConfig = require('./webpack.config.js');

// Переменные проекта

let root = './wwwroot/';
let src = './Client/';

let path = {
		build: { // пути для сборки проектов
			all: 'build/',
			scss: 'build/css/',
			js: 'build/js/', 
			favicon: 'build/favicon/',
			faviconDataFile: 'src/favicon/faviconData.json',
			faviconInject: 'build/**/*.html',
			img: 'build/img/'
		},
		src: { // пути размещения исходных файлов проекта
			html: 'src/*.{html,htm}',
			pug: 'src/pug/*.pug',
			scss: 'src/scss/style.scss',
			js: 'src/js/*.js',
			favicon: 'src/favicon/icon.png',
			img: 'src/img/**/*.{jpeg,jpg,png,svg,gif}'
		},
		watch: { // пути файлов, за изменением которых мы хотим наблюдать
			html: 'src/**/*.{html, htm}',
			scss: 'src/scss/**/*.scss',
			js: 'src/js/**/*.js'
		},
		clean: '**/*' // путь очистки директории для сборки
	},
	// конфигурация browser sync
	config = {
		server: {
			baseDir: "build/",
			index: "bar.html"
		},
		tunnel: true,
		host: 'localhost',
		port: 7787,
		logPrefix: "WebDev"
	},
	site = {
		server: "site.ru",
		user: "tstv",
		pass: "112121",
		port: "10000",
		folder: ""
	};

gulp.task('clean:root', function (done) {
	rimraf(root + path.clean, done);
});

gulp.task('html', function (done) {
	gulp.src(src + 'html/**/*')
		.pipe(htmlclean())
		.pipe(gulp.dest(root + 'html/'));
	done();
});

gulp.task('js', function (done) {
	gulp.src(src + 'js/**/*.js')
		// .pipe(uglify())
		.pipe(gulp.dest(root + 'js/'));
	done();
});

gulp.task('webpack', function (done) {
	gulp.src(src + 'js/**/*.js')
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(root + 'webpack'));
	done();
});

//gulp.task('commonjs', function (done) {
//	gulp.src(src + 'js_dev/**/*.js')
//		.pipe(gulpCommonJS())
//		.pipe(gulp.dest(root + 'commonjs'));
//	done();
//});

//gulp.task('ts', function () {
//	var tsResult = gulp.src(src + 'ts/**/*.ts') // or tsProject.src()
//		.pipe(tsProject());

//	return tsResult.js.pipe(gulp.dest(root + 'ts'));
//});

// Execution

gulp.task('root', gulp.series(gulp.parallel('js', 'webpack'), 'html'));

// задача по умолчанию

gulp.task('default', gulp.series('root'));

// Основные Задачи

gulp.task('test', function (done) {
	gulp.src('src/**/*.*')
		.on('data', function (file) {
			console.log({
				contents: file.contents, // содержимое файла
				path: file.path, // путь до файла
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
		.pipe(gulp.dest(function (file) {
			return file.extname == '.html' ? 'files/html' :
				file.extname == '.css' ? 'files/css' :
					file.extname == '.js' ? 'files/js' : 'files'
		}));
	done();
});

gulp.task('clean:dist', function (done) {
	rimraf('dist', done);
});

gulp.task('move:files', function (done) {
	gulp.src('files/**/*.{html, htm}').pipe(gulp.dest('dist'));
	gulp.src('files/**/*.pug').pipe(gulp.dest('dist/pug/'));
	gulp.src('files/**/*.css').pipe(gulp.dest('dist/css/'));
	gulp.src('files/**/*.scss').pipe(gulp.dest('dist/scss/'));
	gulp.src('files/**/*.js').pipe(gulp.dest('dist/js/'));
	gulp.src('files/assets/**/*.{jpeg,jpg,png,svg,gif}').pipe(gulp.dest('dist/img/'));
	done();
});

gulp.task('move', gulp.series('clean:dist', 'move:files'));

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

gulp.task('args', function (done) {
	console.log(arg);
	done();
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
	realFavicon.generateFavicon({
		masterPicture: path.src.favicon,
		dest: path.build.favicon,
		iconsPath: '/favicon',
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
		markupFile: path.build.faviconDataFile
	},
		function () {
			done();
		});
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
	var currentVersion = JSON.parse(fs.readFileSync(path.build.faviconDataFile)).version;
	realFavicon.checkForUpdates(currentVersion, function (err) {
		if (err) {
			throw err;
		}
	});
});

/* *******************************
	* Development Tasks
********************************** */

// Очистка дериктории для компиляции

gulp.task('clean', function (done) {
	rimraf(path.clean, done);
});

gulp.task('dev:html', function (done) {
	gulp.src(path.src.html)
		.pipe(gulpif(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(path.build.faviconDataFile)).favicon.html_code)))
		.pipe(gulp.dest(path.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:pug', function (done) {
	gulp.src(path.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.all));
	done();
});

gulp.task('dev:scss', function (done) {
	gulp.src(path.src.scss) // main файл
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
		.pipe(gulp.dest(path.build.scss)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:js', function (done) {
	gulp.src(path.src.js) // main файл
		.pipe(rigger()) // rigger
		.pipe(gulp.dest(path.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(gulp.dest(path.build.js)) // готовый файл  min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

let imgminify = new ImgMinify()
	.src(path.src.img)
	.dest(path.build.img)
	.use(ImgMinify.gifsicle({ interlaced: true }))
	.use(ImgMinify.jpegoptim({ progressive: true, max: 60 }))
	.use(ImgMinify.jpegtran({ progressive: true }))
	.use(ImgMinify.optipng({ optimizationLevel: 3 }))
	.use(ImgMinify.pngquant({ speed: 1 }))
	.use(ImgMinify.svgo());

gulp.task('dev:img', function (done) {
	imgminify.run(function (err, files) {
		if (err) {
			throw err;
		}
		console.log('Files optimized successfully!');
	});
	done();
});

gulp.task('dev:imgmin', function (done) {
	gulp.src(path.src.img)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{ removeViewBox: true }]
		}))
		.pipe(gulp.dest(path.build.img));
	done();
});

/* Webserver */

gulp.task('webserver', function (done) {
	browserSync(config); // локальный сервер
	done();
});

/* *******************************
	* Production Tasks
********************************** */

gulp.task('sftp:push', function (done) {
	gulp.src(path.build.all)
		.pipe(sftp({
			host: site.server,
			user: site.user,
			pass: site.pass,
			port: site.port,
			remotePath: site.folder
		}));
	done();
});

gulp.task('prod:html', function (done) {
	gulp.src(path.src.html)
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(path.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(path.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('prod:scss', function (done) {
	gulp.src(path.src.scss)
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(gulp.dest(path.build.scss));
	done();
});

gulp.task('prod:js', function (done) {
	gulp.src(path.src.js)
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify()) // минификация
		.pipe(gulp.dest(path.build.js));
	done();
});

// Отслеживание изменений в проекте

gulp.task('watch', function (done) {
	gulp.watch(path.watch.html, gulp.series('dev:html'), reload({ stream: true }));
	gulp.watch(path.watch.scss, gulp.series('dev:scss'), reload({ stream: true }));
	gulp.watch(path.watch.js, gulp.series('dev:js'), reload({ stream: true }));
	done();
});

// Execution

gulp.task('dev', gulp.series('clean', gulp.parallel('dev:scss', 'dev:js', 'dev:img'/* , 'generate-favicon' */), 'dev:html', 'webserver', 'watch'));

gulp.task('prod', gulp.series('clean', gulp.parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

// задача по умолчанию
gulp.task('build', gulp.series('dev'));