import { INIT_CWD, cwd, args } from './baseHelpers.js';
import { join, dirname } from 'path';

const bindings = ['config.json', 'package.json', 'gulpfile.js'],
	esConfigs = ['tsconfig.json', 'webpack.config.js']

export const configList = INIT_CWD.setBinding(...bindings).assign(INIT_CWD.assignFiles(...esConfigs)),
	{ config, package: $package, gulpfile, tsconfig } = configList;

const { name = '', excludeProjects = [], paths: { root: $root = './', projects: projectsRoot = '' } } = config;

export const { project, context, projectsPath, projList } = name.getContext(projectsRoot, configList, excludeProjects),
	root = join(context, $root);

// Подключаемые модули
const {
	helpers = [], excludeTasks = [],
	es: { useWebpack, esModule, webpackConfig: $webpackConfig = 'webpack.config.js', tsconfig: $tsconfig = 'tsconfig.json' },
	paths: { tasksPath: $tasksPath = 'tasks', build: { root: $build }, src: { root: srcRoot } },
	server: { serverPHP, domain, port, baseDir: $baseDir, index },
	deploy, modules: $modules
} = config,
	_modules = await $modules.importModules(),
	{ browserSync } = _modules,
	server = browserSync.create(),
	reload = async () => server.reload(),
	{ stream } = server,
	{ reload: $reload } = browserSync,
	build = join(root, $build),
	src = join(root, srcRoot),
	baseDir = join(build, $baseDir);

export { helpers, excludeTasks, build, src, serverPHP, deploy, /*useWebpack, esModule*/ };

export default process.node_config = process.node_config ?? {
	modules: _modules.assign({ server, reload, stream, $reload }),
	tasksPath: join(cwd, $tasksPath),
	helpers, excludeTasks, project, context, root, build, src, serverPHP, deploy, //useWebpack, esModule,
	tsconfig, webpackConfig: join(root, $webpackConfig),
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

export const { modules, tasksPath, webpackConfig, paths, serverConfig, serverPHPconfig } = process.node_config;
