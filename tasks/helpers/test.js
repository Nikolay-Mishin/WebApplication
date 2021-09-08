const { log } = console,
	{ cwd } = process;

module.exports = async function test() {
	const tasks = require('./tasks'),
		h = require('./helpers'),
		{ config, modules, useWebpack, arg, relativeRoot, setModeSync, mode, dev, prod } = h,
		{ paths, serverConfig } = config,
		{ server } = modules;

	//log('process\n', process);

	//log('config\n', config);
	log('paths\n', paths);
	//log('serverConfig\n', serverConfig);
	log('useWebpack: ', useWebpack);

	//log('env\n', process.env);
	//log('argv\n', process.argv);
	log('arg\n', arg);
	
	log('root:', cwd());
	log('__dirname:', __dirname);
	log('relative:', relativeRoot(__dirname));

	//log('modules\n', modules);
	//log('tasks\n', tasks);

	//log('server\n', server);
	//log('name\n', server.name);
	//log('devIp\n', server.instance.utils.devIp());

	//const log = { [mode]: {} };
	//log('mode:', mode);
	//log('dev:', dev);
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
	//log('log\n', log);
};
