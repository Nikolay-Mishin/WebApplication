const config = require('../../gulpfile.config'),
	{ root } = config,
	h = require('./helpers'),
	{ arg, setMode } = h,
	{ join } = require('path');

module.exports = async function test() {
	//console.log('process\n', process);
	//console.log('config\n', config);
	////console.log('env\n', process.env);
	////console.log('argv\n', process.argv);
	//console.log('arg\n', arg);
	//console.log('useWebpack: ', h.useWebpack);

	//const log = { [h.mode]: {} };

	//if (h.dev) {
	//	log[h.mode].NODE_ENV = process.env.NODE_ENV;
	//	log[h.mode].dev = h.dev;
	//	log[h.mode].prod = h.prod;
	//}

	//setMode(true);
	//log[h.mode] = {};

	//if (h.prod) {
	//	log[h.mode].NODE_ENV = process.env.NODE_ENV;
	//	log[h.mode].dev = h.dev;
	//	log[h.mode].prod = h.prod;
	//}

	//console.log('log\n', log);

	//console.log('exports\n', h.exports);

	console.log('tasks\n', h.tasks);
	//const args = require(join(root, h.tasks.args));
	//console.log('args\n', args);
};
