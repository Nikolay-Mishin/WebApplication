import { log } from 'console';
import { cwd, env, argv, title } from 'process';
import h from './helpers.js';

const { INIT_CWD, HOMEDRIVE } = env;

export default async function test() {
	const {
			config, modules, tasks, useWebpack, tasksList, args, currTask,
			_dirname, relativeRoot, setModeSync, mode, dev, prod
		} = h,
		{ paths, serverConfig } = config,
		{ server } = modules;

	//log('process\n', process);

	log('env-list\n', { title, cwd: cwd(), INIT_CWD, HOMEDRIVE, tasksList, currTask, args });

	let total = [0, 1, 2, 3, 4].reduce((prev, curr, i, arr) => {
		return prev + curr;
	});
	log('total:', total);
	total = [0, 1, 2, 3, 4].reduce((prev, curr, i, arr) => {
		arr[i] = ++curr; return arr;
	}, 0);
	log('total\n', total);

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
