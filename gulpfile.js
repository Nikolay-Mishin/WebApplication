// <binding ProjectOpened='_test' />

const h = require('./tasks/helpers/helpers'),
	{ tasks, setMode, modules } = h,
	{ series, parallel } = modules.gulp;

Object.assign(exports, tasks);

const { clean, html, js } = exports;
exports.build = series(clean, parallel(html, js));

exports.move = series(clean, exports.move_files);

const { dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js, deploy } = exports;
exports.dev = series(setMode(), clean, parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(setMode(true), clean, parallel(prod_html, prod_scss, prod_js, dev_img));

// задача по умолчанию
exports.default = series(exports.build);

exports.deploy = series(exports.prod, deploy);

exports._test = require('./tasks/helpers/test');

h.exports = exports;

console.log('exports\n', exports);
