const path = require('path'),
	root = __dirname,
	build = path.resolve(root, 'build'),
	src = path.resolve(root, 'src'),
	port = process.env.PORT || 8080,
	//customDomain = process.env.DEV_DOMAIN ? `${process.env.DEV_DOMAIN}` : 'localhost'; // environment = process.env
	customDomain = 'localhost';

module.exports = {
	root,
	build,
	src,
	webpackConfig: require('./webpack.config'), // webpack.config
	// конфигурация browserSync
	serverConfig: {
		server: {
			baseDir: build,
			index: 'index.html'
		},
		tunnel: true,
		proxy: `localhost:${port}`,
		open: false,
		host: customDomain,
		port: 3000, // 7787
		logPrefix: "WebDev",
		//ghostMode: false, /* don't mirror interactions in other browsers */
		//snippetOptions: {
		//	rule: {
		//		match: /<\/body>/i,
		//		fn: snippet => snippet,
		//	},
		//},
	},
	site: {
		host: 'site.ru',
		user: 'tstv',
		pass: '112121',
		port: '10000',
		folder: ''
	},
	paths: {
		build: { // пути для сборки проектов
			all: build,
			html: build + 'html/',
			css: build + 'css/',
			js: build + 'js/',
			favicon: build + 'favicon/',
			faviconDataFile: src + 'favicon/faviconData.json',
			faviconInject: build + '**/*.html',
			img: build + 'img/'
		},
		src: { // пути размещения исходных файлов проекта
			all: src,
			html: src + 'html/**/*.{html,htm}',
			pug: src + 'pug/*.pug',
			scss: src + 'scss/*.scss',
			js: src + 'js/*.{js,js.map}',
			webpack: src + 'js/**/*.js',
			favicon: src + 'favicon/icon.png',
			iconsPath: '/favicon',
			img: src + 'img/**/*.{jpeg,jpg,png,svg,gif}'
		},
		watch: { // пути файлов, за изменением которых мы хотим наблюдать
			html: src + 'html/**/*.{html,htm}',
			scss: src + 'scss/**/*.scss',
			js: src + 'js/**/*.js'
		},
		clean: { // путь очистки директории для сборки
			build: build + '**/*',
			html: build + 'html',
			css: build + 'css',
			js: build + 'js',
			webpack: build + 'webpack'
		}
	}
};
