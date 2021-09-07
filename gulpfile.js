/// <binding ProjectOpened='_tasksWatch, _test' />

const { log } = console,
	tasks = require('./tasks/helpers/tasks'),
	h = require('./tasks/helpers/helpers'),
	{ setMode, modules: { gulp: { series, parallel } } } = h,
	{
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files, deploy: _deploy
	} = tasks;

Object.assign(exports, tasks);

exports.build = series(clean, parallel(html, js));
exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));
exports.deploy = series(exports.prod, _deploy);
exports.move = series(clean, move_files);

// задача по умолчанию
//exports.default = series(exports.build);

exports._tasksWatch = require('./tasks/helpers/tasksWatch');
exports._test = require('./tasks/helpers/test');

//log('exports\n', exports);

const { setModeSync } = h;
setModeSync(true);
log('useWebpack:', h.useWebpack);
log('config.useWebpack:', h.config.useWebpack);
