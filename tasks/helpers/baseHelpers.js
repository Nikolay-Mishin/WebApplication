const { log } = require('console'),
	{ env: { INIT_CWD }, cwd: _cwd, argv: _argv } = require('process'),
	{ existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat } = require('fs'),
	{ join, dirname, relative, basename: base, extname: ext, sep } = require('path');

const is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj);

const cwd = _cwd(),
	argv = _argv.slice(2),
	{ assign, keys, values, fromEntries, entries } = Object,
	parseArgs = (argList, _assign = {}, sep = '^\-+') => {
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
		return assign(_assign, args);
	},
	args = (argList => parseArgs(argList))(argv),
	isArray = obj => Array.isArray(obj),
	isObject = Object.isObject = Object.isObject || (obj => is(Object, obj)),
	isFunc = Function.isFunc || (Function.isFunc = obj => is(Function, obj)),
	hasOwn = Object.prototype.hasOwnProperty,
	define = (obj, prop, desc = {}) => Object.defineProperty(obj, prop, desc),
	register = (obj, prop, value, desc = {}) => hasOwn(prop) ? obj[prop] : define(obj, prop, assign(desc, { value })),
	empty = obj => keys(obj).length == 0,
	filter = Object.filter = (obj, predicate) => fromEntries(entries(obj).filter(predicate)),
	concat = (...list) => [].concat.apply([], ...list),
	slice = (obj, i = 0) => [].slice.call(obj, i),
	bind = (context, ...funcList) => concat(funcList).map(func => func.bind(context)),
	setBind = (context, ...funcList) => assign(context, fromEntries(bind(context, ...funcList)
		.map((func, i) => [funcList[i].name, func]))),
	call = function (context, ...args) { return context.call(context, ...args); },
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
		.bind(function (path, search, { json = true, parent = true, _cwd = true } = {}) {
			log('arguments\n', arguments);
			let args = assign([], arguments, { 2: { json, parent, _cwd } });
			log('args\n', args);
			log('this-bind:', this);
			const filePath = join(path, search),
				file = isDir(path) && isFile(filePath) ? readFile(filePath) : null;
			log('this-searchPath:', this);
			if (file) {
				this.config = this.config || { path, file };
				if (_cwd && path == cwd) this.cwd = { path, file };
				if (parent && path != this.config.path && !(this.parent = this.parent || {})[path]) {
					this.parent[dirname(path)] = file;
				}
				args[2]._cwd = false;
			}
			log('this:', this);
			log('path:', path);
			log('filePath:', filePath);
			log('file:', file);
			log('arguments-slice\n', slice(args, 1));
			return file ? (!json || isObject(file) ? file : JSON.parse(file)) :
				_cwd ? call(this, cwd, ...slice(args, 1)) :
				parent /*&& path != cwd*/ ? call(this, dirname(path), ...slice(args, 1)) : null;
		}),
	assignConfig = function (path, ...configList) {
		//log('this-assignConfig:', this);
		configList = concat(configList).map(config => [fileName(config), searchFile(path, config)]);
		return fromEntries(configList);
	};

module.exports = {
	INIT_CWD, cwd, argv, assign, keys, values, fromEntries, entries, parseArgs, args,
	isArray, isObject, isFunc, hasOwn, define, register,
	empty, filter, concat, slice, bind, setBind, call,
	fileName, isDir, isFile,
	getFolders, getFiles,
	config, project, context, runInContext, searchFile, assignConfig
};
