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
	jsModule: 'es6',
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
			html: join(build, 'html/'),
			css: join(build, 'css/'),
			js: join(build, 'js/'),
			favicon: join(build, 'favicon/'),
			faviconDataFile: join(src, 'favicon/faviconData.json'),
			faviconInject: join(build, '**/*.html'),
			img: join(build, 'img/')
	},
		src: { // пути размещения исходных файлов проекта
			all: src,
			html: join(src, 'html/**/*.{html,htm}'),
			pug: join(src, 'pug/*.pug'),
			scss: join(src, 'scss/*.{scss,sass}'),
			js: join(src, 'js/*.{js,js.map}'),
			webpack: join(src, 'js/**/*.js'),
			favicon: join(src, 'favicon/icon.png'),
			iconsPath: '/favicon',
			img: join(src, 'img/**/*.{jpeg,jpg,png,svg,gif}')
		},
		watch: { // ���� ������, �� ���������� ������� �� ����� ���������
			html: join(src, 'html/**/*.{html,htm}'),
			scss: join(src, 'scss/**/*.scss'),
			js: join(src, 'js/**/*.js')
	},
		clean: { // путь очистки директории для сборки
			build: join(build, '**/*'),
			html: join(build, 'html'),
			css: join(build, 'css'),
			js: join(build, 'js')
	}
}
};
