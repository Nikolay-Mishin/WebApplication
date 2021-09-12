/// <binding ProjectOpened='_tasksWatch, _test' />

import { log } from 'console';
import h from './tasks/helpers/helpers.js';
import tasks from './tasks/helpers/tasks.js';
import _tasksWatch from './tasks/helpers/tasksWatch.js';
import _test from './tasks/helpers/test.js';

const { setMode, setModeSync, modules: { gulp: { series, parallel, src } } } = h,
	{ deploy: _deploy, data: _data } = tasks;

//setMode();

export const {
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files
	} = tasks,
	build = series(clean, parallel(html, js)),
	dev = series(clean, parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	prod = series(setMode(true), clean, parallel(prod_html, prod_scss, prod_js, dev_img)),
	deploy = series(prod, _deploy),
	move = series(clean, move_files);

// задача по умолчанию
//export default build;

export { _tasksWatch, _test };

//Object.assign(tasks, { build, dev, prod, deploy, move, _tasksWatch, _test });
//console.log('exports\n', tasks);

//setModeSync(true);
log('mode:', (await h.webpackConfig).mode);
log('useWebpack:', h.useWebpack);

export const data = () => _data('tasks/**/*');
