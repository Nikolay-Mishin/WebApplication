// <binding AfterBuild='build' ProjectOpened='watch:webpack' />
//'use strict';

// Подключаемые плагины

const config = require('./gulpfile.config'),
	path = require('path'), // path
	{ task, src, dest, watch, lastRun, series, parallel } = require('gulp'), // сам gulp
	browserSync = require("browser-sync"), // плагин перезагрузки браузера
	reload = browserSync.reload,
	rimraf = require('rimraf'), // удаление файлов
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
	webpackConfig = require('./webpack.config'), // webpack.config
	babel = require('gulp-babel'),
	terser = require('terser'),
	gulpTerser = require('gulp-terser');

// Переменные проекта

const { paths, serverConfig, site } = config;

//const clean = require('./tasks/clean');
//task('clean', clean);
function clean(done) {
	rimraf(paths.clean.build, done);
};
exports.clean = clean;

task('clean:html', function(done) {
	rimraf(paths.clean.html, done);
});

task('clean:js', function(done) {
	rimraf(paths.clean.js, done);
});

task('clean:webpack', function(done) {
	rimraf(paths.clean.webpack, done);
});

task('build:html', function(done) {
	src(paths.src.html)
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(htmlclean())
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(dest(paths.build.html));
	done();
});

task('build:js', function(done) {
	src(paths.src.js)
		.pipe(dest(paths.build.js))
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify().on('error', getError))
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(paths.build.js))
		.pipe(getNotify('build:js'));
	done();
});

task('scripts', function(done) {
	src(paths.src.js)
		.pipe(sourcemaps.init())
		.pipe(babel({
			//presets: ['env']
			presets: ['@babel/preset-env']
		}).on('error', babel.logError))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(paths.build.js))
		//.pipe(gulpTerser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulpTerser({}, terser.minify))
		.pipe(dest(paths.build.js));
	done();
});

task('build:webpack', function(done) {
	src(paths.src.all)
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(dest(paths.build.js))
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

task('watch:webpack', function(done) {
	//watch(paths.watch.js, series('build'));
	watch(paths.watch.js);
	done();
});

// Execution

task('html', series('clean:html', 'build:html'));
task('js', series('clean:js', 'build:js'));
task('webpack', series('clean:webpack', 'build:webpack'));

task('build:all', series('html', parallel('webpack')));
//task('build', series('build:webpack'));
//task('build', series('clean', parallel('build:html', 'build:webpack')));
exports.build = series('clean', parallel('build:html', 'build:webpack'));

// задача по умолчанию

task('default', series('build'));

// Основные Задачи

task('move:test', function(done) {
	src('src/**/*')
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
		.pipe(dest(function(file) {
			return file.extname == '.html' ? 'files/html' :
				file.extname == '.css' ? 'files/css' :
					file.extname == '.js' ? 'files/js' : 'files'
		}));
	done();
});

task('move:files', function(done) {
	src('files/**/*.{html,htm}').pipe(dest(paths.build.all));
	src('files/**/*.pug').pipe(dest(paths.build.pug));
	src('files/**/*.css').pipe(dest(paths.build.css));
	src('files/**/*.js').pipe(dest(paths.build.js));
	src('files/assets/**/*.{jpeg,jpg,png,svg,gif}').pipe(dest(paths.build.img));
	done();
});

task('move', series('clean', 'move:files'));

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

task('args', function(done) {
	console.log(arg);
	done();
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
task('generate-favicon', function(done) {
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
task('check-for-favicon-update', function(done) {
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

//task('clean', function(done) {
//	rimraf(paths.clean.build, done);
//});

task('dev:html', function(done) {
	src(paths.src.html)
		.pipe(gulpif(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code)))
		.pipe(dest(paths.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

task('dev:pug', function(done) {
	src(paths.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.build.all));
	done();
});

task('dev:scss', function(done) {
	src(paths.src.scss) // main файл
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
	done();
});

task('dev:js', function(done) {
	src(paths.src.js) // main файл
		.pipe(rigger()) // rigger
		.pipe(dest(paths.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(dest(paths.build.js)) // готовый файл min в build
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

task('dev:img', function(done) {
	imgminify.run(function(err, files) {
		if (err) {
			throw err;
		}
		console.log('Files optimized successfully!');
	});
	done();
});

task('dev:imgmin', function(done) {
	src(paths.src.img)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{ removeViewBox: true }]
		}))
		.pipe(dest(paths.build.img));
	done();
});

/* Webserver */

task('webserver', function(done) {
	browserSync(serverConfig); // локальный сервер
	done();
});

/* *******************************
	* Production Tasks
********************************** */

task('sftp:push', function(done) {
	src(paths.build.all)
		.pipe(sftp({
			host: site.server,
			user: site.user,
			pass: site.pass,
			port: site.port,
			remotePath: site.folder
		}));
	done();
});

task('prod:html', function(done) {
	src(paths.src.html)
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(paths.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

task('prod:scss', function(done) {
	src(paths.src.scss)
		.pipe(sass({
			outputStyle: "compressed",
			sourcemaps: false
		}))
		.pipe(prefixer({
			browsers: ['> 1%'],
			cascade: false,
			remove: true
		}))
		.pipe(dest(paths.build.css));
	done();
});

task('prod:js', function(done) {
	src(paths.src.js)
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify()) // минификация
		.pipe(dest(paths.build.js));
	done();
});

// Отслеживание изменений в проекте

task('watch', function(done) {
	watch(paths.watch.html, series('dev:html'), reload({ stream: true }));
	watch(paths.watch.scss, series('dev:scss'), reload({ stream: true }));
	watch(paths.watch.js, series('dev:js'), reload({ stream: true }));
	done();
});

// Execution

task('dev', series('clean', parallel('dev:scss', 'dev:js', 'dev:img'/* , 'generate-favicon' */), 'dev:html', 'webserver', 'watch'));

task('prod', series('clean', parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

// задача по умолчанию
task('build:dev', series('dev'));
