/// <binding ProjectOpened='_tasksWatch, _test' />

const tasks = require('./tasks/helpers/tasks'),
	{ modules: { gulp: { series, parallel } }, setMode } = require('./tasks/helpers/helpers'), {
	clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
	move_files, deploy: _deploy
} = tasks;

Object.assign(exports, tasks);

exports.build = series(clean, parallel(html, js));
exports.move = series(clean, move_files);
exports.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch);
exports.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img));
exports.deploy = series(exports.prod, _deploy);

// задача по умолчанию
//exports.default = series(exports.build);

exports._tasksWatch = require('./tasks/helpers/tasksWatch');
exports._test = require('./tasks/helpers/test');

console.log('exports\n', exports);

const fs = require('fs');
console.log('exists:', fs.existsSync('tsconfig.json'));
console.log('module:', JSON.parse(fs.readFileSync('tsconfig.json')).compilerOptions.module);

const config = require('./gulpfile.config'), { useWebpack } = config;
console.log('useWebpack:', (useWebpack) ? useWebpack : '');
