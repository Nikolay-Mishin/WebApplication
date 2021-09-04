import process from 'process';
const h = require('./helpers'),
	{ config, arg, useWebpack, modules, tasks, setModeSync, mode, dev, prod } = h,
	{ paths, serverConfig } = config,
	{ server } = modules,
	{ cwd, __dirname, __relative } = process;

module.exports = async function test() {
	const { exports: _exports } = h;
	console.log('_h: ', _h);

	//console.log('process\n', process);

	//console.log('config\n', config);
	console.log('paths\n', paths);
	//console.log('serverConfig\n', serverConfig);
	console.log('useWebpack: ', useWebpack);

	//console.log('env\n', process.env);
	//console.log('argv\n', process.argv);
	console.log('arg\n', arg);
	
	console.log('root:', root);
	console.log('__dirname:', __dirname(import.meta));
	console.log('relative:', __relative(import.meta));

	//console.log('modules\n', modules);
	//console.log('tasks\n', tasks);
	//console.log('exports\n', _exports);

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
