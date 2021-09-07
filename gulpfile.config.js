const path = require('path'),
	{ join, relative } = path,
	root = __dirname,
	build = join(root, 'wwwroot'),
	srcRoot = 'src',
	src = join(root, srcRoot),
	serverPHP = false,
	domain = 'localhost', // WebApplication / localhost
	port = 8080,
	baseDir = join(build, 'html'),
	index = 'app',
	relativeRoot = from => relative(from, root);

const browserSync = require('browser-sync'), // плагин перезагрузки браузера
	server = browserSync.create(),
	reload = async () => server.reload();

module.exports = process.node_config = process.node_config || {
	root, build, src, serverPHP,
	tasksPath: join(root, 'tasks'),
	//useWebpack: true,
	//esModule: 'es6',
	//webpackConfig: join(root, 'webpack.config.js'),
	helpers: { relativeRoot },
	deploy: {
		host: 'site.ru',
		user: 'tstv',
		pass: '112121',
		port: '7070',
		folder: '',
		include: ['*.htaccess'],
		exclude: [
			'.git', '.vs', 'bin', 'obj', 'Properties', '**/node_modules', '**/bower_components',
			'**/Thumbs.db', '**/*.DS_Store', '.gitattributes', '.gitignore', '*.sln', '*.cs',
			'*.doc.*', 'appsettings.json', 'appsettings.Development.json'
		]
	},
	paths: {
		root,
		// пути для сборки проекта
		build: {
			root: build,
			html: join(build, 'html/'),
			css: join(build, 'css/'),
			js: join(build, 'js/'),
			favicon: join(build, 'favicon/'),
			faviconDataFile: join(src, 'favicon/faviconData.json'),
			faviconInject: join(build, '**/*.html'),
			img: join(build, 'img/')
		},
		// пути размещения исходных файлов проекта
		src: {
			root: src,
			html: join(src, 'html/**/*.{html,htm}'),
			php: join(src, 'php/**/*.php'),
			pug: join(src, 'pug/*.pug'),
			scss: join(src, 'scss/*.{scss,sass}'),
			js: join(src, 'js/**/*.js'),
			favicon: join(src, 'favicon/icon.png'),
			iconsPath: '/favicon',
			img: join(src, 'img/**/*.{jpeg,jpg,png,svg,gif}')
		},
		// пути файлов, за изменением которых мы хотим наблюдать
		watch: {
			html: join(srcRoot, 'html/**/*.{html,htm}'),
			scss: join(srcRoot, 'scss/**/*.{scss, sass}'),
			js: join(srcRoot, 'js/**/*.js')
		},
		// путь очистки директории для сборки
		clean: {
			build: join(build, '**/*'),
			html: join(build, 'html'),
			css: join(build, 'css'),
			js: join(build, 'js')
		},
		tasks: {
			watch: {
				tasks: 'tasks/**/*',
				root: ['*.js', '*config*', '*lint*', '!*doc*'],
				doc: '*doc*',
				server: ['../../../package.json', '../../../.editorconfig'],
			},
			root: '../../..',
			deploy: '../_server'
		}
	},
	// Подключаемые модули
	modules: {
		gulp: require('gulp'), // сам gulp
		fs: require('fs'), // работа с файловой системой
		path, // работа с путями
		browserSync: browserSync, // плагин перезагрузки браузера
		_reload: browserSync.reload,
		server,
		reload,
		stream: server.stream,
		gulpif: require('gulp-if'), // плагин для условий
		gutil: require('gulp-util'), // отладка
		notify: require('gulp-notify'), // отладка
		plumber: require('gulp-plumber'), // отладка
		rimraf: require('rimraf'), // удаление файлов
		rename: require('gulp-rename'), // плагин переименования файлов
		sourcemaps: require('gulp-sourcemaps'), // плагин создания map-файлов
		htmlmin: require('gulp-htmlmin'), // плагин сжатия html
		htmlclean: require('gulp-htmlclean'),
		pug: require('gulp-pug'), // плагин компиляции pug
		inlineCss: require('gulp-inline-css'),
		sass: require('gulp-sass'), // плагин компиляции scss (+ node-sass)
		prefixer: require('gulp-autoprefixer'), // плагин расстановки префиксов
		rigger: require('gulp-rigger'), // плагин объединения js
		concat: require('concat'),
		uglify: require('gulp-uglify'), // плагин сжатия js
		webpack: require('webpack'), // webpack
		webpackStream: require('webpack-stream'), // webpack
		babel: require('gulp-babel'),
		terser: require('terser'),
		gulpTerser: require('gulp-terser'),
		realFavicon: require('gulp-real-favicon'), // генератор фавиконок
		imageMin: require('gulp-imagemin'), // оптимизация картинок
		ImgMinify: require('imgminify') // оптимизация картинок
	},
	// конфигурация browserSync
	serverConfig: {
		// "http://example.com/" - проксирование вашего удаленного сервера, не важно на чем back-end
		[domain != 'localhost' ? 'proxy' : 'server']: domain != 'localhost' ? `http://${domain}` : {
			baseDir: baseDir,
			index: `${index}.${serverPHP ? 'php' : 'html'}`
		},
		host: domain, // 'example.com' - можно использовать ip сервера
		port: port, // порт через который будет проксироваться сервер
		open: domain == 'localhost' ? true : 'external', // указываем, что наш url внешний
		notify: true,
		logPrefix: domain, // префикс для лога bs, маловажная настройка
	},
	serverPHPconfig: {
		base: build,
		keepalive: true,
		hostname: domain,
		port: port,
		open: false
	}
};
