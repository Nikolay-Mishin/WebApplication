/// <binding ProjectOpened='_tasksWatch' />

const { log } = console,
	h = require('./tasks/helpers/helpers'),
	{ tasks, assign, setMode, modules: { gulp: { series, parallel } } } = h,
	{
		clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		move_files, deploy: _deploy, data: _data
	} = assign(exports, tasks);

//setMode()();

exports.build = series(clean, parallel(html, js));
exports.dev = series(clean, parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(setMode(true), clean, parallel(prod_html, prod_scss, prod_js, dev_img));
exports.deploy = series(exports.prod, _deploy);
exports.move = series(clean, move_files);

// задача по умолчанию
//export default build;

exports._tasksWatch = require('./tasks/helpers/tasksWatch');
exports._test = require('./tasks/test/test');

//console.log('exports\n', tasks);

setMode(true)();
log('mode:', h.webpackConfig.mode);
log('useWebpack:', h.useWebpack);

exports.data = () => _data('tasks/**/*');
