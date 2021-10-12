// <binding BeforeBuild='_tasksWatch' AfterBuild='_tasksWatch' Clean='_tasksWatch' ProjectOpened='_tasksWatch' />
//package.json: , "-vs-binding":{"BeforeBuild":["tasksWatch"],"AfterBuild":["tasksWatch"],"Clean":["tasksWatch"],"ProjectOpened":["tasksWatch"]}

import { log } from 'console';
import h from './tasks/helpers/helpers.js';
import _tasksWatch from './tasks/helpers/tasksWatch.js';
import _test from './tasks/test/test.js';

const { tasks, setMode, modules: { gulp: { series, parallel } } } = h,
	{ deploy: _deploy, data: _data } = await tasks;

export const {
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files
} = await tasks,
	build = series(clean, parallel(html, js)),
	dev = series(clean, parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	prod = series(setMode(true), clean, parallel(prod_html, prod_scss, prod_js, dev_img)),
	deploy = series(prod, _deploy),
	move = series(clean, move_files);

// задача по умолчанию
//export default build;

export { _tasksWatch, _test };

tasks.assign({ build, dev, prod, deploy, move, _tasksWatch, _test });
//console.log('exports\n', await tasks);

setMode(true)();
log('mode:', (await h.webpackConfig).mode);
log('useWebpack:', h.useWebpack);

export const data = () => _data('tasks/**/*');

//import _export from './tasks/test/export.js';
//import module from './tasks/test/module.js';
//import { module as mod, consumer, consumer2015, consumer2017 } from './tasks/test/module.js';

//log('module\n', module);
//log('mod\n', mod);
//log('consumer\n', consumer);
//log('consumer2015\n', consumer2015);
//log('consumer2017\n', consumer2017);
