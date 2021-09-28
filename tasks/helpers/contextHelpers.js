import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { readFileSync as readFile } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { assign, keys, fromEntries, create, call, protoList } from './baseHelpers.js';

export const { INIT_CWD } = env,
	cwd = _cwd(),
	argv = _argv.slice(2),
	parseArgs = (argList, sep = '^\-+') => {
		let args = {}, opt, thisOpt, curOpt;
		argList.forEach(arg => {
			thisOpt = arg.trim();
			opt = thisOpt.replace(new RegExp(sep), '');
			if (thisOpt === opt) {
				if (curOpt) args[curOpt] = opt; // argument value
				curOpt = null;
			}
			else args[curOpt = opt] = true; // argument name
		});
		return args;
	},
	args = (argList => parseArgs(argList))(argv),
	config = !'config.json'.isFile() ? {} : JSON.parse(readFile('config.json')),
	{ project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = isDir(_projectsPath),
			projectsPath = exist ? _projectsPath : cwd,
			projects = projectsPath.getFolders({ exclude })
				.concat(exist ? [] : dirname(projectsPath).getFolders({ exclude })),
			arg = args._filter(([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : keys(arg)[1] || (exist && INIT_CWD != cwd ? INIT_CWD : cwd).fileName(),
			contextPath = join(projectsPath, project),
			context = exist && contextPath.isDir() ? contextPath : projectsPath;
		//log('INIT_CWD:', INIT_CWD);
		//log('cwd:', cwd);
		//log('projectsPath:', projectsPath);
		//log('exist:', exist);
		//log('cwd.fileName():', cwd.fileName());
		//log('name:', name);
		//log('project:', project);
		//log('context:', context);
		//log('args:', args);
		//log('arg:', arg);
		//log('projects:', projects);
		return { project, context };
	})();

const h = ({}).registerAll(
	function runInContext(path, cb) {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	function searchFile(path, search, { json = true, parent = true, _cwd = true } = {}) {
		return call(function (path, search, { json = true, parent = true, _cwd = true } = {}) {
			let args = assign([], arguments, { 2: { json, parent, _cwd } });
			//log('args\n', args);
			//log('this-bind:', this);
			const filePath = join(path, search),
				file = path.isDir() && filePath.isFile() ? readFile(filePath) : null;
			//file = !json || _file.isObject() ? _file : JSON.parse(_file);
			if (file) {
				this.config = this.config || { path, file };
				if (_cwd && path == cwd) {
					args[2]._cwd = false;
					this.cwd = { path, file };
				}
				if (parent && path != this.config.path && !(this.parent = this.parent || {})[path]) {
					this.parent[path] = file;
				}
			}
			//log('this:', this);
			//log('args-slice:', args.slice(1));
			//log('file:', file);
			return _cwd ? call(this, cwd, ...args.slice(1)) :
				parent && path != dirname(path) ? call(this, dirname(path), ...args.slice(1)) :
					file && !this.empty() ? this : null;
		}, ...arguments);
	},
	function assignConfig(path, ...configList) { return {}.callBind(arguments, function (path, ...configList) {
		configList = configList.concat().map(config => [config.fileName(), path.searchFile(config)]);
		//log('this-assignConfig:', this);
		//log('searchFile:', searchFile);
		//log('searchFile:', configList);

		const func1 = function (obj) {
			log('this:', this);
			log('obj:', obj);
		};

		Object._register(func1);
		Object._register(function func2(obj) {
			log('this:', this);
			log('obj:', obj);
		});

		log('protoList:', protoList());

		const obj = Object._define(func1, { prop: 'fn' }),
			obj2 = create(Object), // return {} => __proto__ = obj
			obj3 = new Object(Object), // return obj => __proto__ = obj.__proto__
			obj4 = Object.create(obj),
			obj5 = new Object(obj);

		//log('Object:', Object);
		//log('protoList-Object:', Object.protoList());

		//log('obj:', obj);
		//log('protoList-obj-define:', obj.protoList());

		//log('obj2:', obj2);
		//log('protoList-obj2-Object.create(Object):', obj2.protoList());

		//log('obj3:', obj3);
		//log('protoList-obj3-new Object(Object):', obj3.protoList());

		//log('obj4:', obj4);
		//log('protoList-obj4-Object.create(obj):', obj4.protoList());

		//log('obj5:', obj5);
		//log('protoList-obj5-new Object(obj):', obj5.protoList());

		//log('protoList-{}:', {}.protoList());
		//log('protoList-{}:', [].protoList());
		//log('protoList-Object:', Object.protoList());
		//log('protoList-Array:', Array.protoList());
		//log('protoList-Function:', Function.protoList());
		//log('protoList-() => { }:', (()=>{})).protoList();
		//log('protoList-searchFile:', searchFile.protoList());

		//Object.func();
		//Object.func2();

		return fromEntries(configList);
	}); }
);

export const { runInContext, searchFile, assignConfig } = h;

export default { INIT_CWD, cwd, argv, parseArgs, args, project, context }.assignDefine(h);
