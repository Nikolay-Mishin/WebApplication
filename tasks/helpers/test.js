const h = require('./helpers'),
	{ config, arg, useWebpack, modules, tasks, exports: _exports, setModeSync, mode, dev, prod } = h,
	{ paths, serverConfig } = config,
	{ server } = modules;

module.exports = async function test() {
	//console.log('process\n', process);
	//console.log('config\n', config);
	console.log('paths\n', paths);
	console.log('serverConfig\n', serverConfig);
	//console.log('env\n', process.env);
	//console.log('argv\n', process.argv);
	console.log('arg\n', arg);
	console.log('useWebpack: ', useWebpack);

	//console.log('modules\n', modules);
	console.log('tasks\n', tasks);
	console.log('exports\n', _exports);

	//console.log('server\n', server);
	//console.log('name\n', server.name);
	//console.log('devIp\n', server.instance.utils.devIp());

	const log = { [mode]: {} };
	if (dev) {
		log[mode].mode = mode;
		log[mode].dev = dev;
		log[mode].prod = prod;
	}
	setModeSync(true);
	console.log('mode\n', mode, dev, prod);
	log[h.mode] = {};
	if (h.prod) {
		log[h.mode].mode = h.mode;
		log[h.mode].dev = h.dev;
		log[h.mode].prod = h.prod;
	}
	console.log('log\n', log);
};
