// <binding ProjectOpened='_test' />

import gulp from 'gulp';
import { dirname } from 'path';
const { series, parallel, watch, src, dest, lastRun } = gulp;

const gulpfile = async () => watch(['*.js', '*.json', 'tasks/**/*'], function gulpfile() {
	src(['gulpfile.js', '*.config.js'], { since: lastRun(gulpfile) }).on('data', file => {
		console.log(file.relative);
	})
		.pipe(dest('../_server'))
		.pipe(dest('../../..'));
	return src(['tasks/**/*'], { since: lastRun(gulpfile) }).on('data', file => {
		console.log(`tasks/${file.relative}`);
	})
		.pipe(dest('../_server/tasks'))
		.pipe(dest('../../../tasks'));
});

export { gulpfile };

//import h from 'server/_helpers';
//import config from 'server';

//const { tasks, setMode, modules } = h;

console.log('url\n', import.meta.url);

//console.log('h\n', h);
//console.log('tasks\n', tasks);
//console.log('setMode\n', setMode);
//console.log('modules\n', modules);

//console.log('config\n', config);

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
