const config = require('../../gulpfile.config'),
	{ root } = config,
	h = require('./helpers'),
	{ arg, setMode } = h,
	{ join } = require('path');

module.exports = async function test() {
	//console.log('process\n', process);
	//console.log('config\n', config);
	//console.log('env\n', process.env);
	//console.log('argv\n', process.argv);
	//console.log('arg\n', arg);
	//console.log('useWebpack: ', h.useWebpack);

	console.log('helpers\n', h);
	console.log('modules\n', h.modules);
	console.log('tasks\n', h.tasks);
	console.log('exports\n', h.exports);

	//const log = { [h.mode]: {} };
	//if (h.dev) {
	//	log[h.mode].mode = h.mode;
	//	log[h.mode].dev = h.dev;
	//	log[h.mode].prod = h.prod;
	//}
	//setMode(true);
	//log[h.mode] = {};
	//if (h.prod) {
	//	log[h.mode].mode = h.mode;
	//	log[h.mode].dev = h.dev;
	//	log[h.mode].prod = h.prod;
	//}
	//console.log('log\n', log);
};
