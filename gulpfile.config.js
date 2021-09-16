import { log } from 'console';
import { cwd as _cwd, argv as _argv } from 'process';
import h from './tasks/helpers/baseHelpers.js';

const { importModules, config, context, cwd, project } = h,
	// Подключаемые модули
	modules = await importModules({
		gulp: 'gulp',
		fs: 'fs',
		path: 'path',
		browserSync: 'browser-sync',
		gulpif: 'gulp-if',
		gutil: 'gulp-util',
		notify: 'gulp-notify',
		plumber: 'gulp-plumber',
		changed: 'gulp-changed',
		rimraf: 'rimraf',
		rename: 'gulp-rename',
		sourcemaps: 'gulp-sourcemaps',
		htmlmin: 'gulp-htmlmin',
		htmlclean: 'gulp-htmlclean',
		pug: 'gulp-pug',
		inlineCss: 'gulp-inline-css',
		sass: 'gulp-sass',
		prefixer: 'gulp-autoprefixer',
		rigger: 'gulp-rigger',
		concat: 'concat',
		uglify: 'gulp-uglify',
		webpack: 'webpack',
		webpackStream: 'webpack-stream',
		babel: 'gulp-babel',
		terser: 'terser',
		gulpTerser: 'gulp-terser',
		realFavicon: 'gulp-real-favicon',
		imageMin: 'gulp-imagemin',
		ImgMinify: 'imgminify'
	}),
	{ path, browserSync } = modules,
	server = browserSync.create(),
	reload = async () => server.reload(),
	{ stream } = server,
	{ reload: _reload } = browserSync,
	{ join } = path,
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

Object.assign(modules, { server, reload, stream, _reload });

export default process.node_config = process.node_config || {
	modules, h, root, build, src, serverPHP, deploy, //useWebpack, esModule,
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
