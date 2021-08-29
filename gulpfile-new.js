// <binding AfterBuild='build' ProjectOpened='watch:webpack' />
//'use strict';

const { task, src, dest, watch, series, parallel, lastRun } = require('gulp'); // сам gulp
	//fs = require('fs'), // работа с файловой системой
	//{ paths, serverConfig, site } = require('./gulpfile.config'),
	//{ arg, imgMinify } = require('./_helpers'),
	//browserSync = require('browser-sync'), // плагин перезагрузки браузера
	//reload = browserSync.reload,
	//gulpif = require('gulp-if'), // плагин для условий
	//gutil = require('gulp-util'), // отладка
	//notify = require('gulp-notify'), // отладка
	//plumber = require('gulp-plumber'), // отладка
	//rimraf = require('rimraf'), // удаление файлов
	//rename = require('gulp-rename'), // плагин переименования файлов
	//sourcemaps = require('gulp-sourcemaps'), // плагин создания map-файлов
	//htmlmin = require('gulp-htmlmin'), // плагин сжатия html
	//htmlclean = require('gulp-htmlclean'),
	//pug = require('gulp-pug'), // плагин компиляции pug
	//inlineCss = require('gulp-inline-css'),
	//sass = require('gulp-sass'), // плагин компиляции scss (+ node-sass)
	//prefixer = require('gulp-autoprefixer'), // плагин расстановки префиксов
	//rigger = require('gulp-rigger'), // плагин объединения js
	//concat = require('concat'),
	//uglify = require('gulp-uglify'), // плагин сжатия js
	//webpack = require('webpack'), // webpack
	//webpackStream = require('webpack-stream'), // webpack
	//webpackConfig = require('./webpack.config'), // webpack.config
	//babel = require('gulp-babel'),
	//terser = require('terser'),
	//gulpTerser = require('gulp-terser'),
	//realFavicon = require('gulp-real-favicon'), // генератор фавиконок
	//imageMin = require('gulp-imagemin'), // оптимизация картинок
	//ImgMinify = require('imgminify'); // оптимизация картинок

/* Очистка директории проекта */

//const clean = require('./tasks/clean');
//exports.clean = clean;
task('clean', require('./tasks/clean'));
task('clean:html', require('./tasks/clean-'));
task('clean:js', require('./tasks/clean-js'));
task('clean:webpack', require('./tasks/clean-webpack'));

/* Основные задачи */
task('build:html', require('./tasks/build-html'));
task('build:js', require('./tasks/build-js'));
task('scripts', require('./tasks/scripts'));
task('build:webpack', require('./tasks/build-webpack'));
task('watch:webpack', require('./tasks/watch-webpack'));

/* Execution */

task('html', series('clean:html', 'build:html'));
task('js', series('clean:js', 'build:js'));
task('webpack', series('clean:webpack', 'build:webpack'));

task('build:all', series('html', parallel('webpack')));
task('build', series('clean', parallel('build:html', 'build:webpack')));
//exports.build = series('clean', parallel('build:html', 'build:webpack'));

/* Files Tasks */
task('move:test', require('./tasks/move-test'));
task('move:files', require('./tasks/move-files'));
task('move', series('clean', 'move:files'));

/* Check Cmd Arguments */
task('args', require('./tasks/args'));

/* Images Tasks */
task('generate-favicon', require('./tasks/generate-favicon'));
task('check-for-favicon-update', require('./tasks/check-for-favicon-update'));

/* Development Tasks */
task('dev:html', require('./tasks/dev-html'));
task('dev:pug', require('./tasks/dev-pug'));
task('dev:scss', require('./tasks/dev-scss'));
task('dev:js', require('./tasks/dev-js'));
task('dev:img', require('./tasks/dev-img'));
task('dev:imgmin', require('./tasks/dev-imgmin'));
// Webserver
task('server', require('./tasks/server'));

/* Production Tasks */
task('sftp:push', require('./tasks/sftp-push'));
task('prod:html', require('./tasks/prod-html'));
task('prod:scss', require('./tasks/prod-scss'));
task('prod:js', require('./tasks/prod-js'));
task('watch', require('./tasks/watch'));

/* Execution */
task('dev', series('clean', parallel('dev:html', 'dev:scss', 'dev:js', 'dev:img'/*, 'generate-favicon'*/), 'server', 'watch'));
task('prod', series('clean', parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

// задача по умолчанию
task('default', series('build'));

/* *********************
 * Очистка директории проекта
 ********************** */

//task('clean:html', function(done) {
//	rimraf(paths.clean.html, done);
//});

//task('clean:js', function(done) {
//	rimraf(paths.clean.js, done);
//});

//task('clean:webpack', function(done) {
//	rimraf(paths.clean.webpack, done);
//});

/* *********************
 * Основные Задачи
 ********************** */

//task('build:html', function(done) {
//	src(paths.src.html)
//		.pipe(sourcemaps.init()) // Инициализируем sourcemap
//		.pipe(htmlclean())
//		.pipe(sourcemaps.write('.')) // Пропишем карты
//		.pipe(dest(paths.build.html));
//	done();
//});

//task('build:js', function(done) {
//	src(paths.src.js)
//		.pipe(dest(paths.build.js))
//		.pipe(sourcemaps.init()) // Инициализируем sourcemap
//		.pipe(uglify().on('error', getError))
//		.pipe(sourcemaps.write('.')) // Пропишем карты
//		.pipe(rename({ suffix: '.min' }))
//		.pipe(dest(paths.build.js))
//		.pipe(getNotify('build:js'));
//	done();
//});

//task('scripts', function(done) {
//	src(paths.src.js)
//		.pipe(sourcemaps.init())
//		.pipe(babel({
//			//presets: ['env']
//			presets: ['@babel/preset-env']
//		}).on('error', babel.logError))
//		.pipe(concat('app.js'))
//		.pipe(sourcemaps.write('.'))
//		.pipe(dest(paths.build.js))
//		//.pipe(gulpTerser())
//		.pipe(rename({ suffix: '.min' }))
//		.pipe(gulpTerser({}, terser.minify))
//		.pipe(dest(paths.build.js));
//	done();
//});

//task('build:webpack', function(done) {
//	src(paths.src.all)
//		.pipe(webpackStream(webpackConfig), webpack)
//		.pipe(dest(paths.build.js))
//		.pipe(getNotify('build:webpack'));
//	done();
//});

//function getError(err) {
//	gutil.log(gutil.colors.red('[Error]'), err.toString());
//}

//function getNotify(title, message = 'Scripts Done') {
//	return notify({
//		title: title,
//		message: message
//	});
//}

// Отслеживание изменений в проекте

//task('watch:webpack', function(done) {
//	//watch(paths.watch.js, series('build'));
//	watch(paths.watch.js);
//	done();
//});

/* *********************
 * Execution
 ********************** */

//task('html', series('clean:html', 'build:html'));
//task('js', series('clean:js', 'build:js'));
//task('webpack', series('clean:webpack', 'build:webpack'));

//task('build:all', series('html', parallel('webpack')));
//task('build', series('clean', parallel('build:html', 'build:webpack')));

// задача по умолчанию
//task('default', series('build'));

/* *********************
 * Files Tasks
 ********************** */

//task('move:test', function(done) {
//	src('src/**/*').on('data', function(file) {
//		console.log({
//			contents: file.contents, // содержимое файла
//			path: file.paths, // путь до файла
//			cwd: file.cwd, // основная директория
//			base: file.base, // базовая директория
//			// helpers
//			relative: file.relative, // имя файла относительно текущей директории
//			dirname: file.dirname, // имя текущей директории
//			basename: file.basename, // название файла
//			stem: file.stem, // имя файла
//			extname: file.extname // расширение файла
//		});
//	})
//	.pipe(dest(function(file) {
//		return file.extname == '.html' ? 'files/html' :
//			file.extname == '.css' ? 'files/css' :
//				file.extname == '.js' ? 'files/js' : 'files'
//	}));
//	done();
//});

//task('move:files', function(done) {
//	src('files/**/*.{html,htm}').pipe(dest(paths.build.all));
//	src('files/**/*.pug').pipe(dest(paths.build.pug));
//	src('files/**/*.css').pipe(dest(paths.build.css));
//	src('files/**/*.js').pipe(dest(paths.build.js));
//	src('files/assets/**/*.{jpeg,jpg,png,svg,gif}').pipe(dest(paths.build.img));
//	done();
//});

/* *********************
 * Check Cmd Arguments
 ********************** */

//const arg = (argList => {
//	let arg = {}, a, opt, thisOpt, curOpt;
//	for (a = 0; a < argList.length; a++) {
//		thisOpt = argList[a].trim();
//		opt = thisOpt.replace(/^\-+/, '');

//		if (opt === thisOpt) {
//			// argument value
//			if (curOpt) arg[curOpt] = opt;
//			curOpt = null;
//		}
//		else {
//			// argument name
//			curOpt = opt;
//			arg[curOpt] = true;
//		}
//	}
//	return arg;
//})(process.argv);

//task('args', function(done) {
//	console.log(arg);
//	done();
//});

/* *********************
 * Images Tasks
 ********************** */

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
//task('generate-favicon', function(done) {
//	realFavicon.generateFavicon({
//		masterPicture: paths.src.favicon,
//		dest: paths.build.favicon,
//		iconsPath: paths.src.iconsPath,
//		design: {
//			ios: {
//				pictureAspect: 'backgroundAndMargin',
//				backgroundColor: '#ffffff',
//				margin: '39%',
//				assets: {
//					ios6AndPriorIcons: false,
//					ios7AndLaterIcons: false,
//					precomposedIcons: false,
//					declareOnlyDefaultIcon: true
//				}
//			},
//			desktopBrowser: {},
//			windows: {
//				pictureAspect: 'whiteSilhouette',
//				backgroundColor: '#00aba9',
//				onConflict: 'override',
//				assets: {
//					windows80Ie10Tile: false,
//					windows10Ie11EdgeTiles: {
//						small: false,
//						medium: true,
//						big: false,
//						rectangle: false
//					}
//				}
//			},
//			androidChrome: {
//				pictureAspect: 'shadow',
//				themeColor: '#ffffff',
//				manifest: {
//					name: 'Barcode',
//					display: 'standalone',
//					orientation: 'notSet',
//					onConflict: 'override',
//					declared: true
//				},
//				assets: {
//					legacyIcon: false,
//					lowResolutionIcons: false
//				}
//			},
//			safariPinnedTab: {
//				pictureAspect: 'silhouette',
//				themeColor: '#5bbad5'
//			}
//		},
//		settings: {
//			scalingAlgorithm: 'Mitchell',
//			errorOnImageTooSmall: false,
//			readmeFile: false,
//			htmlCodeFile: false,
//			usePathAsIs: false
//		},
//		markupFile: paths.build.faviconDataFile
//	}, done);
//	//function() {
//	//	done();
//	//});
//});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
//task('check-for-favicon-update', function() {
//	let currentVersion = JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).version;
//	realFavicon.checkForUpdates(currentVersion, err => { if (err) throw err; });
//});

/* *******************************
	* Development Tasks
********************************** */

// Очистка дериктории для компиляции

//task('clean', function(done) {
//	rimraf(paths.clean.build, done);
//});

//task('dev:html', function(done) {
//	src(paths.src.html)
//		.pipe(gulpif(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code)))
//		.pipe(dest(paths.build.all))
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

//task('dev:pug', function(done) {
//	src(paths.src.pug)
//		.pipe(pug({
//			pretty: true
//		}))
//		.pipe(dest(paths.build.all));
//	done();
//});

//task('dev:scss', function(done) {
//	src(paths.src.scss) // main файл
//		.pipe(sourcemaps.init()) // Инициализируем sourcemap
//		.pipe(sass({
//			outputStyle: 'compressed', // минимиация файла
//			sourcemaps: true
//		}
//		).on('error', sass.logError))
//		.pipe(prefixer({
//			browsers: ['> 1%'], // last 5 versions
//			cascade: false, // запрет на разворот кода
//			remove: true // удаление лишних стилей при обработке
//		}))
//		.pipe(sourcemaps.write('.')) // Пропишем карты
//		.pipe(dest(paths.build.css)) // готовый файл min в build
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

//task('dev:js', function(done) {
//	src(paths.src.js) // main файл
//		.pipe(rigger()) // rigger
//		.pipe(dest(paths.build.js)) // готовый файл в build
//		.pipe(sourcemaps.init()) // Инициализируем sourcemap
//		.pipe(uglify()) // сжатие js
//		.pipe(sourcemaps.write('.')) // Пропишем карты
//		.pipe(rename({ suffix: '.min' })) // переименовывание файла
//		.pipe(dest(paths.build.js)) // готовый файл min в build
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

//let imgMinify = new ImgMinify()
//	.src(paths.src.img)
//	.dest(paths.build.img)
//	.use(ImgMinify.gifsicle({ interlaced: true }))
//	.use(ImgMinify.jpegoptim({ progressive: true, max: 60 }))
//	.use(ImgMinify.jpegtran({ progressive: true }))
//	.use(ImgMinify.optipng({ optimizationLevel: 3 }))
//	.use(ImgMinify.pngquant({ speed: 1 }))
//	.use(ImgMinify.svgo());

//task('dev:img', function(done) {
//	imgMinify.run(function(err, files) {
//		if (err) {
//			throw err;
//		}
//		console.log('Files optimized successfully!');
//	});
//	done();
//});

//task('dev:imgmin', function(done) {
//	src(paths.src.img)
//		.pipe(imageMin({
//			interlaced: true,
//			progressive: true,
//			optimizationLevel: 5,
//			svgoPlugins: [{ removeViewBox: true }]
//		}))
//		.pipe(dest(paths.build.img));
//	done();
//});

/* Webserver */

//task('server', function(done) {
//	browserSync(serverConfig); // локальный сервер
//	done();
//});

/* *******************************
	* Production Tasks
********************************** */

//task('sftp:push', function(done) {
//	src(paths.build.all)
//		.pipe(sftp({
//			host: site.server,
//			user: site.user,
//			pass: site.pass,
//			port: site.port,
//			remotePath: site.folder
//		}));
//	done();
//});

//task('prod:html', function(done) {
//	src(paths.src.html)
//		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(paths.build.faviconDataFile)).favicon.html_code))
//		.pipe(htmlmin({ collapseWhitespace: true }))
//		.pipe(dest(paths.build.all))
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

//task('prod:scss', function(done) {
//	src(paths.src.scss)
//		.pipe(sass({
//			outputStyle: "compressed",
//			sourcemaps: false
//		}))
//		.pipe(prefixer({
//			browsers: ['> 1%'],
//			cascade: false,
//			remove: true
//		}))
//		.pipe(dest(paths.build.css))
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

//task('prod:js', function(done) {
//	src(paths.src.js)
//		.pipe(rigger()) // собрать в одном файле код из скриптов
//		.pipe(uglify()) // минификация
//		.pipe(dest(paths.build.js))
//		.pipe(reload({ stream: true })); // И перезагрузим сервер
//	done();
//});

// Отслеживание изменений в проекте

//task('watch', function(done) {
//	watch(paths.watch.html, series('dev:html'), reload({ stream: true }));
//	watch(paths.watch.scss, series('dev:scss'), reload({ stream: true }));
//	watch(paths.watch.js, series('dev:js'), reload({ stream: true }));
//	done();
//});

/* *******************************
	* Execution
********************************** */

//task('dev', series('clean', parallel('dev:html', 'dev:scss', 'dev:js', 'dev:img'/* , 'generate-favicon' */), 'server', 'watch'));
//task('prod', series('clean', parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

// задача по умолчанию
//task('default', series('dev'));
