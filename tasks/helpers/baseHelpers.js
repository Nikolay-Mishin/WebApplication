import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import { existsSync as exist, readFileSync as readFile, readdirSync as readDir, statSync as stat } from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
import { imports, importModules } from './import.js';

export { imports, importModules };
export const { INIT_CWD } = env,
	cwd = _cwd(),
	argv = _argv.slice(2),
	parseArgs = (argList, assign = {}, sep = '^\-+') => {
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
		return Object.assign(assign, args);
	},
	args = (argList => parseArgs(argList))(argv),
	isArray = obj => Array.isArray(obj),
	isObject = Object.isObject = Object.isObject || (function (obj) { return obj != null && obj.constructor === this; })
		.bind(Object),
	keys = obj => Object.keys(obj),
	values = obj => Object.values(obj),
	empty = obj => keys(obj).length == 0,
	fromEntries = entries => Object.fromEntries(entries),
	entries = obj => Object.entries(obj),
	filter = Object.filter = (obj, predicate) => fromEntries(entries(obj).filter(predicate)),
	concat = list => list.concat.apply([], list),
	bind = (context, ...funcList) => concat(funcList).map(func => func.bind(context)),
	setBind = (context, ...funcList) => Object.assign(context, fromEntries(bind(context, ...funcList)
		.map((func, i) => [funcList[i].name, func]))),
	_dirname = meta => dirname(toPath(meta.url)),
	_relative = (from, to) => relative(from.url ? _dirname(from) : from, to),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFolders = (path, { exclude = [] } = {}) => readDir(path).filter(f => isDir(join(path, f)) && !exclude.includes(f)),
	getFiles = (path, { exclude = [], nonExt = false } = {}) => readDir(path)
		.filter(file => isFile(join(path, file)) && !exclude.includes(nonExt ? fileName(file) : file))
		.map(file => nonExt ? file.replace(ext(file), '') : file),
	config = !isFile('config.json') ? {} : JSON.parse(readFile('config.json')),
	{ project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = isDir(_projectsPath),
			projectsPath = exist ? _projectsPath : cwd,
			projects = getFolders(projectsPath, { exclude })
				.concat(exist ? [] : getFolders(dirname(projectsPath), { exclude })),
			arg = filter(args, ([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : keys(arg)[1] || fileName(exist && INIT_CWD != cwd ? INIT_CWD : cwd),
			contextPath = join(projectsPath, project),
			context = exist && isDir(contextPath) ? contextPath : projectsPath;
		//log('INIT_CWD:', INIT_CWD);
		//log('cwd:', cwd);
		//log('projectsPath:', projectsPath);
		//log('exist:', exist);
		//log('fileName(cwd):', fileName(cwd));
		//log('name:', name);
		//log('project:', project);
		//log('context:', context);
		//log('args:', args);
		//log('arg:', arg);
		//log('projects:', projects);
		return { project, context };
	})(),
	runInContext = (path, cb) => {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	searchFile = (function (...args) { return this.call(this, ...args); })
		.bind(function (path, search, { json = false, parent = true, _cwd = true } = {}) {
			log('arguments-bind\n', arguments);
			log('arguments\n', json, parent, _cwd);
			const searchPath = (path) => {
				const filePath = join(path, search),
					file = isDir(path) && isFile(filePath) ? readFile(filePath) : null;
				this.config = this.config || file;
				log('this-searchPath:', this);
				log('path:', path);
				log('filePath:', filePath);
				log('file:', file);
				log('this.config:', this.config);
				return file ? file :
					parent ? this(dirname(path)) :
					_cwd ? this(cwd) : null;
			},
				file = searchPath(path);
			log('this-bind:', this);
			return !json || isObject(file) ? file : JSON.parse(file);
		}),
	assignConfig = (path, ...configList) => {
		configList = concat(configList).map(config => [fileName(config), searchFile(path, config)]);
		return fromEntries(configList);
	};

export default {
	imports, importModules,
	INIT_CWD, cwd, argv, parseArgs, args,
	isArray, isObject, keys, values, empty, fromEntries, entries, filter, concat, bind, setBind,
	_dirname, _relative, fileName, isDir, isFile,
	getFolders, getFiles,
	config, project, context, runInContext, searchFile, assignConfig
};
