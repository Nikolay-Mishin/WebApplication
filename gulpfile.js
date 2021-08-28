// <binding AfterBuild='build' ProjectOpened='watch:webpack' />
//'use strict';

function HTML() {
	return src('app/**/*.html', { since: lastRun(HTML) })
		.pipe(dest('dist/'))
		.pipe(browserSync.stream())
}
exports.HTML = HTML;

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(path.build.faviconDataFile)).version;
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
//	rimraf(path.clean.build, done);
//});

gulp.task('dev:html', function(done) {
	gulp.src(path.src.html)
		.pipe(gulpif(arg.fav, realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(path.build.faviconDataFile)).favicon.html_code)))
		.pipe(gulp.dest(path.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:pug', function(done) {
	gulp.src(path.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.all));
	done();
});

gulp.task('dev:scss', function(done) {
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
		.pipe(gulp.dest(path.build.css)) // готовый файл min в build
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('dev:js', function(done) {
	gulp.src(path.src.js) // main файл
		.pipe(rigger()) // rigger
		.pipe(gulp.dest(path.build.js)) // готовый файл в build
		.pipe(sourcemaps.init()) // Инициализируем sourcemap
		.pipe(uglify()) // сжатие js
		.pipe(sourcemaps.write('.')) // Пропишем карты
		.pipe(rename({ suffix: '.min' })) // переименовывание файла
		.pipe(gulp.dest(path.build.js)) // готовый файл min в build
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

gulp.task('webserver', function(done) {
	browserSync(config); // локальный сервер
	done();
});

/* *******************************
	* Production Tasks
********************************** */

gulp.task('sftp:push', function(done) {
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

gulp.task('prod:html', function(done) {
	gulp.src(path.src.html)
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(path.build.faviconDataFile)).favicon.html_code))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(path.build.all))
		.pipe(reload({ stream: true })); // И перезагрузим сервер
	done();
});

gulp.task('prod:scss', function(done) {
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
		.pipe(gulp.dest(path.build.css));
	done();
});

gulp.task('prod:js', function(done) {
	gulp.src(path.src.js)
		.pipe(rigger()) // собрать в одном файле код из скриптов
		.pipe(uglify()) // минификация
		.pipe(gulp.dest(path.build.js));
	done();
});

// Отслеживание изменений в проекте

gulp.task('watch', function(done) {
	gulp.watch(path.watch.html, gulp.series('dev:html'), reload({ stream: true }));
	gulp.watch(path.watch.scss, gulp.series('dev:scss'), reload({ stream: true }));
	gulp.watch(path.watch.js, gulp.series('dev:js'), reload({ stream: true }));
	done();
});

// Execution

gulp.task('dev', gulp.series('clean', gulp.parallel('dev:scss', 'dev:js', 'dev:img'/* , 'generate-favicon' */), 'dev:html', 'webserver', 'watch'));

gulp.task('prod', gulp.series('clean', gulp.parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img')));

exports.default = series(HTML, SASS, scripts, myServer);
