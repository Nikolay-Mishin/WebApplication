import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import { existsSync as exist, readFileSync as readFile, readdirSync as readDir, statSync as stat } from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
import { imports, importModules } from './import.js';

const is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj);

export { imports, importModules };
export const { INIT_CWD } = env,
	cwd = _cwd(),
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
	{ isArray } = Array,
	isObject = Object.isObject || (Object.isObject = obj => is(Object, obj)),
	isFunc = Function.isFunc || (Function.isFunc = obj => is(Function, obj)),
	protoList = (function _protoList(obj) {
		const proto = this.proto = obj.__proto__;
		let protoList = [];
		this.protoList = this.protoList || [];
		if (proto) {
			log('proto:', proto);
			this.protoList.push(_protoList.call(this, proto));
			return proto;
			//this.protoList.push(proto);
			//_protoList.call(this, proto);
			protoList = this.protoList;
			log('this.protoList:', this.protoList);
			this.protoList = [];
			log('protoList:', protoList);
		}
		log('end:', { proto, protoList, this: this.protoList });
		return protoList;
	}).bind({}),
	getProto = (obj, i = 0) => protoList(obj, i),
	hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(...arguments),
	define = (obj, prop, value, desc = {}) => hasOwn(obj, prop) ? value : Object.defineProperty(obj, prop, assign(desc, { value })),
	register = (obj, prop, value) => hasOwn(obj, prop) || !obj.__proto__ ? value : obj.__proto__[prop] = value,
	empty = obj => (isObject ? keys(obj) : obj).length == 0,
	filter = Object.filter = (obj, predicate) => fromEntries(entries(obj).filter(predicate)),
	concat = (...list) => [].concat.apply([], ...list),
	slice = (obj, i = 0) => [].slice.call(obj, i),
	bind = (context, ...funcList) => concat(funcList).map(func => func.bind(context)),
	getBind = (context, func) => bind(context, func).shift(),
	setBind = (context, ...funcList) => assign(context, fromEntries(bind(context, ...funcList)
		.map((func, i) => [funcList[i].name, func]))),
	call = (context, ...args) => context.call(context, ...args),
	callBind = (context, args, cb) => cb.call(context, ...args),
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
	searchFile = function (path, search, { json = true, parent = true, _cwd = true } = {}) { return call(
		function (path, search, { json = true, parent = true, _cwd = true } = {}) {
			let args = assign([], arguments, { 2: { json, parent, _cwd } });
			//log('args\n', args);
			//log('this-bind:', this);
			const filePath = join(path, search),
				file = isDir(path) && isFile(filePath) ? readFile(filePath) : null;
			//file = !json || isObject(_file) ? _file : JSON.parse(_file);
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
			//log('args-slice:', slice(args, 1));
			//log('file:', file);
			return _cwd ? call(this, cwd, ...slice(args, 1)) :
				parent && path != dirname(path) ? call(this, dirname(path), ...slice(args, 1)) :
				file && !empty(this) ? this : null;
		}, ...arguments);
	},
	assignConfig = function (path, ...configList) {
		return callBind({}, arguments, function (path, ...configList) {
			configList = concat(configList).map(config => [fileName(config), searchFile(path, config)]);
			//log('this-assignConfig:', this);
			//log('searchFile:', searchFile);
			//log('searchFile:', configList);

			const func = function () {
				log('this:', this)
			}

			log('protoList-Object:', protoList(Object));
			//log('Object:', Object);
			//log('protoList-searchFile:', protoList(searchFile));

			Object.__proto__._my_func = func;
			const obj = Object.defineProperty(Object, 'func', { value: func });
			//Object.func();
			//Object.func();
			//({}).func();

			//log('Object.__proto__:', Object.__proto__);
			//log('Object.prototype:', Object.prototype);

			//searchFile.prototype.__proto__.func = func;
			//searchFile.func();
			//Function.func();
			//(() => { }).func();

			//log('protoList-Object:', protoList(Object));
			//log('Object:', Object);
			//log('protoList-searchFile:', protoList(searchFile));
			//log('obj:', obj);
			
			return fromEntries(configList);
		});
	};

export default {
	imports, importModules,
	INIT_CWD, cwd, argv, assign, keys, values, fromEntries, entries, parseArgs, args,
	isArray, isObject, isFunc, hasOwn, define, register,
	empty, filter, concat, slice, bind, getBind, setBind, call,
	_dirname, _relative, fileName, isDir, isFile,
	getFolders, getFiles,
	config, project, context, runInContext, searchFile, assignConfig
};
