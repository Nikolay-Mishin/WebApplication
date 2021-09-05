const tasks = require('./tasks'),
	h = require('./helpers'),
	{ config, modules, useWebpack, arg, relativeRoot, setModeSync, mode, dev, prod } = h,
	{ paths, serverConfig } = config,
	{ server } = modules,
	{ cwd } = process;

module.exports = async function test() {
	//console.log('process\n', process);

	//console.log('config\n', config);
	console.log('paths\n', paths);
	//console.log('serverConfig\n', serverConfig);
	console.log('useWebpack: ', useWebpack);

	//console.log('env\n', process.env);
	//console.log('argv\n', process.argv);
	console.log('arg\n', arg);
	
	console.log('root:', cwd());
	console.log('__dirname:', __dirname);
	console.log('relative:', relativeRoot(__dirname));

	//console.log('modules\n', modules);
	//console.log('tasks\n', tasks);

	//console.log('server\n', server);
	//console.log('name\n', server.name);
	//console.log('devIp\n', server.instance.utils.devIp());

	//const log = { [mode]: {} };
	//if (dev) {
	//	log[mode].mode = mode;
	//	log[mode].dev = dev;
	//	log[mode].prod = prod;
	//}
	//setModeSync(true);
	//log[h.mode] = {};
	//if (h.prod) {
	//	log[h.mode].mode = h.mode;
	//	log[h.mode].dev = h.dev;
	//	log[h.mode].prod = h.prod;
	//}
	//console.log('log\n', log);
};
