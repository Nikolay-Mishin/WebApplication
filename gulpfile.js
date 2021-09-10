// <binding ProjectOpened='_tasksWatch, _test' />

import _tasksWatch from './tasks/helpers/tasksWatch.js';
import _test from './tasks/helpers/test.js';
export { _tasksWatch, _test };

import h from './tasks/helpers/helpers.js';
import tasks from './tasks/helpers/tasks.js';

const { log } = console,
	{ setMode, modules: { gulp: { series, parallel, src } } } = h;

log('tasks\n', tasks);

export const //_tasksWatch = (await import('./tasks/helpers/tasksWatch.js')).default,
	//_test = (await import('./tasks/helpers/test.js')).default,
	{
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files, deploy: _deploy
	} = tasks;
	//build = series(clean, parallel(html, js)),
	//dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	//prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img)),
	//deploy = series(prod, _deploy),
	//move = series(clean, move_files);

// задача по умолчанию
//export default tasks.build;

Object.assign(tasks, { /*build, dev, prod, deploy, move, */_tasksWatch, _test });

console.log('exports\n', tasks);
console.log('build\n', clean, html, js);

const { setModeSync } = h;
//h.webpackConfig;
setModeSync(true);
//h.webpackConfig;
//log('useWebpack:', h.useWebpack);

export const data = () => src('tasks/**/*').on('data', function (file) {
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
