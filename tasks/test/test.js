import h, {
	log, env, cwd, INIT_CWD, HOMEDRIVE, argv, title,
	from, project, context, projectsPath, projList, root
	//document, nodeList, html, htmlEl
} from '../helpers/helpers.js';

export default async () => {
	const {
		config, modules, tasks, useWebpack, args, currTask,
		dirname, setModeSync, mode, dev, prod
	} = h,
		{ paths, serverConfig } = config,
		{ server } = modules;

	//log('process\n', process);

	//log('env-list\n', { title, cwd: cwd(), INIT_CWD, HOMEDRIVE, args, currTask });

	//log('env\n', env);
	//log('argv\n', argv);
	//log('args\n', args);
	
	//log('root:', cwd());
	//log('$dirname:', dirname(import.meta));
	//log('relative:', dirname(import.meta).relativeRoot());

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

	//({}).unregister(...keys(filterWithout(h, helpers)));

	log('h:', h);

	({}).unregister();

	log({}.setBinding);

	const proto = {}.unregister('setBinding');

	log('proto:', proto);
	log('props:', proto.getProps());

	log('from:', from(new Map([[0, '1'], [1, '2']])));
	log('from:', from({ 0: '1', 1: '2' }));
	log('reverse:', { 0: '1', 1: '2' }.reverse());
	log('reverse:', new Map([[0, '1'], [1, '2']]).reverse());
	log('fromEntries:', [['1', '2'], ['0', '1']].fromEntries());

	//log('document:', document);
	//log('location:', document.location);

	//log('nodeList:', nodeList);
	//log('html:', html);
	//log('htmlEl:', htmlEl);

	log('projList:', projList);

	'project:'.log(project);
	'root:'.log(root);
	'context:'.log(context);
	'projectsPath:'.log(projectsPath);
}
