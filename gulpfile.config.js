const { log } = require('console'),
	{ cwd: _cwd, argv: _argv } = require('process'),
	{ importModules } = require('./tasks/helpers/import'),
	// Подключаемые модули
	modules = importModules({
		gulp: 'gulp', // сам gulp
		fs: 'fs', // работа с файловой системой
		path: 'path', // работа с путями
		browserSync: 'browser-sync', // плагин перезагрузки браузера
		gulpif: 'gulp-if', // плагин для условий
		gutil: 'gulp-util', // отладка
		notify: 'gulp-notify', // отладка
		plumber: 'gulp-plumber', // отладка
		changed: 'gulp-changed', // плагин отслеживания изменений
		rimraf: 'rimraf', // удаление файлов
		rename: 'gulp-rename', // плагин переименования файлов
		sourcemaps: 'gulp-sourcemaps', // плагин создания map-файлов
		htmlmin: 'gulp-htmlmin', // плагин сжатия html
		htmlclean: 'gulp-htmlclean', // плагин очистки (пробелов) html
		pug: 'gulp-pug', // плагин компиляции pug
		inlineCss: 'gulp-inline-css',
		sass: 'gulp-sass', // плагин компиляции scss (+ node-sass)
		prefixer: 'gulp-autoprefixer', // плагин расстановки префиксов
		rigger: 'gulp-rigger', // плагин объединения js
		concat: 'concat', // плагин объединения js
		uglify: 'gulp-uglify', // плагин сжатия js
		webpack: 'webpack', // webpack
		webpackStream: 'webpack-stream', // webpack
		babel: 'gulp-babel',
		terser: 'terser',
		gulpTerser: 'gulp-terser',
		realFavicon: 'gulp-real-favicon', // генератор фавиконок
		imageMin: 'gulp-imagemin', // оптимизация изображений
		ImgMinify: 'imgminify' // оптимизация изображений
	}),
	{ path, browserSync } = modules,
	{ join } = path,
	server = browserSync.create(),
	reload = async () => server.reload(),
	{ stream } = server,
	{ reload: _reload } = browserSync,
	{ config, context, cwd, assignConfig } = require('./tasks/helpers/baseHelpers'),
	{
		es: { useWebpack, esModule, webpackConfig },
		paths: { tasksPath = 'tasks', root: _root = '.', build: { root: _build }, src: { root: srcRoot } },
		server: { serverPHP, domain, port, baseDir: _baseDir, index },
		deploy
	} = config,
	root = join(context, _root),
	build = join(root, _build),
	src = join(root, srcRoot),
	baseDir = join(build, _baseDir);

assignConfig(context, 'config.json');

module.exports = process.node_config = process.node_config || {
	root, build, src, serverPHP, deploy, //useWebpack, esModule,
	modules: Object.assign(modules, { server, reload, stream, _reload }),
	tasksPath: join(cwd, tasksPath),
	//webpackConfig: join(root, webpackConfig),
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
			root: '../../..',
			deploy: '../_server',
			watch: {
				tasks: 'tasks/**/*',
				root: ['*.js', '*config*', '*lint*', '!*doc*'],
				doc: 'doc/**/*',
				package: 'package.json',
				server: ['../../../package.json', '../../../.editorconfig']
			}
		}
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
