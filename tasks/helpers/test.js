import { log } from 'console';
import { cwd, env, argv, title } from 'process';
import h from './helpers.js';

const { INIT_CWD, HOMEDRIVE } = env;

export default async function test() {
	const { config, modules, tasks, useWebpack, currTask, arg, __dirname, relativeRoot, setModeSync, mode, dev, prod } = h,
		{ paths, serverConfig } = config,
		{ server } = modules;

	//log('process\n', process);

	log('env-list\n', { title, cwd: cwd(), INIT_CWD, HOMEDRIVE, currTask, arg });

	//log('env\n', env);
	//log('argv\n', argv);
	//log('arg\n', arg);
	
	//log('root:', cwd());
	//log('__dirname:', __dirname);
	//log('relative:', relativeRoot(__dirname));

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
