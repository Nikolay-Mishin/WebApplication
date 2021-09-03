// <binding ProjectOpened='_test' />

import gulp from 'gulp';
const { series, parallel } = gulp;

import config from './gulpfile.config.js'; // 'server'
import { root } from './gulpfile.config.js'; // 'root'

import _tasksWatch from './tasks/helpers/tasksWatch.js'; // 'server/_tasksWatch'

export { _tasksWatch };

//console.log('paths\n', config.paths);
console.log('root:', root);

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

//const { dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js, deploy } = exports;
//exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
//exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));

//// задача по умолчанию
//exports.default = series(exports.build);

//exports.deploy = series(exports.prod, deploy);

//exports._test = require('./tasks/helpers/test');

h.exports = exports;

//console.log('exports\n', exports);

/* === Export all keys === */

//const api = [
//	'access',
//	'appendFile',
//	'chmod',
//	'chown',
//	'close',
//	'copyFile',
//	'fchmod',
//	'fchown',
//	'fdatasync',
//	'fstat',
//	'fsync',
//	'ftruncate',
//	'futimes',
//	'lchown',
//	'lchmod',
//	'link',
//	'lstat',
//	'mkdir',
//	'mkdtemp',
//	'open',
//	'readFile',
//	'readdir',
//	'readlink',
//	'realpath',
//	'rename',
//	'rmdir',
//	'stat',
//	'symlink',
//	'truncate',
//	'unlink',
//	'utimes',
//	'writeFile'
//].filter(key => {
//	// Some commands are not available on some systems. Ex:
//	// fs.copyFile was added in Node.js v8.5.0
//	// fs.mkdtemp was added in Node.js v5.10.0
//	// fs.lchown is not available on at least some Linux
//	return typeof fs[key] === 'function';
//});

//// Export all keys:
//Object.keys(fs).forEach(key => {
//	if (key === 'promises') {
//		// fs.promises is a getter property that triggers ExperimentalWarning
//		// Don't re-export it here, the getter is defined in "lib/index.js"
//		return;
//	}
//	exports[key] = fs[key]
//});
