import { cwd as _cwd, argv as _argv } from 'process';
import h from './tasks/helpers/baseHelpers.js';

import gulp from 'gulp'; // сам gulp
import fs from 'fs'; // работа с файловой системой
import path from 'path'; // работа с путями
import browserSync from 'browser-sync'; // плагин перезагрузки браузера
import gulpif from 'gulp-if'; // плагин для условий
import gutil from 'gulp-util'; // отладка
import notify from 'gulp-notify'; // отладка
import plumber from 'gulp-plumber'; // errorHandler
import changed from 'gulp-changed';
import rimraf from 'rimraf'; // удаление файлов
import rename from 'gulp-rename'; // плагин переименования файлов
import sourcemaps from 'gulp-sourcemaps'; // плагин создания map-файлов
import htmlmin from 'gulp-htmlmin'; // плагин сжатия html
import htmlclean from 'gulp-htmlclean';
import pug from 'gulp-pug'; // плагин компиляции pug
import inlineCss from 'gulp-inline-css';
import sass from 'gulp-sass'; // плагин компиляции scss (+ node-sass)
import prefixer from 'gulp-autoprefixer'; // плагин расстановки префиксов
import rigger from 'gulp-rigger'; // плагин объединения js
import concat from 'concat';
import uglify from 'gulp-uglify'; // плагин сжатия js
import webpack from 'webpack'; // webpack
import webpackStream from 'webpack-stream'; // webpack
import babel from 'gulp-babel';
import terser from 'terser';
import gulpTerser from 'gulp-terser';
import realFavicon from 'gulp-real-favicon'; // генератор фавиконок
import imageMin from 'gulp-imagemin'; // оптимизация картинок
import ImgMinify from 'imgminify'; // оптимизация картинок

const { join } = path,
	{ project, context, config, cwd } = h,
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

const server = browserSync.create(),
	reload = async () => server.reload(),
	{ stream } = server,
	{ reload: _reload } = browserSync;

export default process.node_config = process.node_config || {
	h, root, build, src, serverPHP, deploy, //useWebpack, esModule,
	tasksPath: join(cwd, tasksPath),
	//webpackConfig: join(root, webpackConfig),
	// Подключаемые модули
	modules: {
		gulp,
		fs, path,
		browserSync, reload, server, stream, _reload,
		gulpif, gutil, notify, plumber, changed,
		rimraf, rename, sourcemaps,
		htmlmin, htmlclean, pug,
		inlineCss, sass, prefixer,
		rigger, concat, uglify, webpack, webpackStream,
		babel, terser, gulpTerser,
		realFavicon, imageMin, ImgMinify
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
