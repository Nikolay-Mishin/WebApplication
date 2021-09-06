/// <binding ProjectOpened='_tasksWatch, _test' />

//import _tasksWatch from './tasks/helpers/tasksWatch.js';
//import _test from './tasks/helpers/test.js';

import h from './tasks/helpers/helpers.js';
import tasks from './tasks/helpers/tasks.js';
const { modules: { gulp: { series, parallel } }, setMode } = h
console.log('exports\n', tasks);
export const {
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files, deploy: _deploy
	} = tasks;
	//build = series(clean, parallel(html, js)),
	//dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	//prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img)),
	//deploy = series(tasks.prod, _deploy),
	//move = series(clean, move_files),
	//_tasksWatch = (await import('./tasks/helpers/tasksWatch.js')).default,
	//_test = (await import('./tasks/helpers/test.js')).default;

Object.assign(tasks, { /*build, dev, prod, deploy, move, _tasksWatch, _test*/ });

// задача по умолчанию
//export default tasks.default = series(build);

console.log('exports\n', tasks);
console.log('build\n', clean, html, js);

import fs from 'fs';
console.log('exists:', fs.existsSync('tsconfig.json'));
console.log('module:', JSON.parse(fs.readFileSync('tsconfig.json')).compilerOptions.module);

import config from './gulpfile.config.js';
const { useWebpack } = config;
console.log('useWebpack:', (useWebpack) ? useWebpack : '');
