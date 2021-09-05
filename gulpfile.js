/// <binding ProjectOpened='_tasksWatch' />

import _tasksWatch from './tasks/helpers/tasksWatch.js';
export { _tasksWatch };

import tasks from './tasks/helpers/tasks.js';
console.log('exports\n', tasks);

//import h from './tasks/helpers/helpers.js';
//const { setMode, modules } = h,
//	{ series, parallel } = modules.gulp,
//	{
//		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
//		deploy: _deploy
//	} = tasks,
//	build = tasks.build = series(clean, parallel(html, js)),
//	move = tasks.move = series(clean, tasks.move_files),
//	dev = tasks.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
//	prod = tasks.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img)),
//	deploy = tasks.deploy = series(tasks.prod, _deploy),
//	_test = tasks._test = require('./tasks/helpers/test');

//export { build, move, dev, prod, deploy, _test };

// задача по умолчанию
//export default tasks.default = series(tasks.build);
