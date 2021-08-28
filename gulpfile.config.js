const path = require('path')
const { join } = require('path'),
	root = __dirname,
	build = join(root, 'build'),
	src = join(root, 'src'),
	port = process.env.PORT || 8080,
	customDomain = process.env.DEV_DOMAIN ? process.env.DEV_DOMAIN : 'localhost'; // environment = process.env

const root = __dirname,
	build = path.resolve(root, 'build'),
	src = path.resolve(root, 'src');

module.exports = {
	root,
	build,
	src,
	// конфигурация browser sync
	serverConfig: {
		server: {
			baseDir: build,
			index: 'index.html'
		},
		tunnel: true,
		host: 'localhost',
		port: 7787,
		logPrefix: "WebDev"
	},
	site: {
		server: 'site.ru',
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
	},
	copyDependencies: {
		dist: path.join(src, 'local_modules')
	}
}
};
