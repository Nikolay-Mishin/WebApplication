// <binding BeforeBuild='$tasksWatch, $test' AfterBuild='$tasksWatch' Clean='$tasksWatch' ProjectOpened='$tasksWatch' />
// package.json: , "-vs-binding":{"BeforeBuild":["tasksWatch"],"AfterBuild":["tasksWatch"],"Clean":["tasksWatch"],"ProjectOpened":["tasksWatch","tasks"]}

import { log } from 'console';
import tasks from './tasks/helpers/tasks.js';
import h from './tasks/helpers/helpers.js';
import $tasksWatch from './tasks/helpers/tasksWatch.js';
import $test from './tasks/test/test.js';

const { deploy: $deploy, data: $data } = tasks,
	{ setMode, modules: { gulp: { series, parallel } } } = h;

export const {
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files
} = tasks,
	build = series(clean, parallel(html, js)),
	dev = series(clean, parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	prod = series(setMode(true), clean, parallel(prod_html, prod_scss, prod_js, dev_img)),
	deploy = series(prod, $deploy),
	move = series(clean, move_files);

// задача по умолчанию
//export default build;

export { $tasksWatch, $test };

tasks.assign({ build, dev, prod, deploy, move, $tasksWatch, $test });
//log('exports\n', tasks);

setMode(true)();
log('mode:', (await h.webpackConfig).mode);
log('useWebpack:', h.useWebpack);

export const data = () => $data('tasks/**/*');

//import $export from './tasks/test/export.js';
//import module from './tasks/test/module.js';
//import { module as mod, consumer, consumer2015, consumer2017 } from './tasks/test/module.js';

//log('module\n', module);
//log('mod\n', mod);
//log('consumer\n', consumer);
//log('consumer2015\n', consumer2015);
//log('consumer2017\n', consumer2017);
