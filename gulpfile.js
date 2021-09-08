/// <binding ProjectOpened='_tasksWatch, _test' />

const { log } = console,
	tasks = require('./tasks/helpers/tasks'),
	h = require('./tasks/helpers/helpers'),
	{ setMode, modules: { gulp: { series, parallel, src } } } = h,
	{
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files, deploy: _deploy
	} = tasks;

Object.assign(exports, tasks);

exports.build = series(clean, parallel(html, js));
exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));
exports.deploy = series(exports.prod, _deploy);
exports.move = series(clean, move_files);

// задача по умолчанию
//exports.default = series(exports.build);

exports._tasksWatch = require('./tasks/helpers/tasksWatch');
exports._test = require('./tasks/helpers/test');

//log('exports\n', exports);

const { setModeSync } = h;
h.webpackConfig;
setModeSync(true);
h.webpackConfig;
log('useWebpack:', h.useWebpack);

exports.data = () => src('tasks/**/*').on('data', function (file) {
	log({
		contents: file.contents, // содержимое файла
		path: file.path, // путь до файла
		cwd: file.cwd, // основная директория
		base: file.base, // базовая директория
		dirname: file.dirname, // имя текущей директории
		relative: file.relative, // имя файла относительно текущей директории
		basename: file.basename, // название файла
		stem: file.stem, // имя файла
		extname: file.extname // расширение файла
		/*
		contents: <Buffer>,
		path: 'D:\\YandexDisk\\__Web_dev\\_.server\\Open Server\\domains\\WebApplication\\tasks\\helpers\\helpers.js',
		cwd: 'D:\\YandexDisk\\__Web_dev\\_.server\\Open Server\\domains\\WebApplication',
		base: 'D:\\YandexDisk\\__Web_dev\\_.server\\Open Server\\domains\\WebApplication\\tasks',
		dirname: 'D:\\YandexDisk\\__Web_dev\\_.server\\Open Server\\domains\\WebApplication\\tasks\\helpers',
		relative: 'helpers\\helpers.js',
		basename: 'helpers.js',
		stem: 'helpers',
		extname: '.js'
		*/
	});
		//.pipe(changed('www', { hasChanged: changed.compareContents }))
		//.pipe(dest('www'));
});
