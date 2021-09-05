/// <binding ProjectOpened='_tasksWatch, _test' />

exports._tasksWatch = require('./tasks/helpers/tasksWatch');

const tasks = require('./tasks/helpers/tasks'),
	{ modules: { gulp: { series, parallel } }, setMode } = require('./tasks/helpers/helpers'), {
	clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
	deploy: _deploy
} = tasks;

Object.assign(exports, tasks);

exports.build = series(clean, parallel(html, js));
exports.move = series(clean, tasks.move_files);
exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));
exports.deploy = series(exports.prod, _deploy);
exports._test = require('./tasks/helpers/test');

// задача по умолчанию
//exports.default = series(exports.build);

console.log('exports\n', exports);
