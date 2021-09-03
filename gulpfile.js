// <binding ProjectOpened='_test' />

import gulp from 'gulp';
const { series, parallel } = gulp;

import config from './gulpfile.config.js'; // 'server'

//11
import _tasksWatch from './tasks/helpers/tasksWatch.js'; // 'server/_tasksWatch'

export { _tasksWatch };

console.log('config\n', config.paths);

//import h from './tasks/helpers/helpers.js';

//const { tasks, setMode, modules } = h;

//console.log('h\n', h);
//console.log('tasks\n', tasks);
//console.log('setMode\n', setMode);
//console.log('modules\n', modules);

//const h = require('./tasks/helpers/helpers'),
//	{ tasks, setMode, modules } = h,
//	{ series, parallel } = modules.gulp;

//Object.assign(exports, tasks);

//const { clean, html, js } = exports;
//exports.build = series(clean, parallel(html, js));

//exports.move = series(clean, exports.move_files);

//const { dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js } = exports;
//exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
//exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));

//// задача по умолчанию
////exports.default = series(exports.build);

//exports.deploy = series(prod, rs);

//exports._test = require('./tasks/helpers/test');

//h.exports = exports;

//console.log('exports\n', exports);
