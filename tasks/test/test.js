const { log } = console,
	{ env, cwd, argv, title } = process,
	{ INIT_CWD, HOMEDRIVE } = env,
	h = require('./helpers');

module.exports = async function test() {
	const {
			config, modules, tasks, useWebpack, tasksList, args, currTask,
			relativeRoot, setModeSync, mode, dev, prod
		} = h,
		{ paths, serverConfig } = config,
		{ server } = modules;

	//log('process\n', process);

	//log('tasksList\n', tasksList);

	//log('env-list\n', { title, cwd: cwd(), INIT_CWD, HOMEDRIVE, currTask, args });

	//log('env\n', env);
	//log('argv\n', argv);
	//log('args\n', args);
	
	//log('root:', cwd());
	//log('_dirname:', _dirname);
	//log('relative:', relativeRoot(_dirname));

	//log('config\n', config);
	//log('paths\n', paths);
	//log('serverConfig\n', serverConfig);
	//log('useWebpack: ', useWebpack);

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
