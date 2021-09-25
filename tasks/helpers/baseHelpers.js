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
	{ assign, keys, values, fromEntries, entries, getPrototypeOf } = Object,
	{ isArray } = Array,
	isObject = Object.isObject || (Object.isObject = obj => is(Object, obj)),
	isFunc = Function.isFunc || (Function.isFunc = obj => is(Function, obj)),
	createObj = (proto = Object, ...assignList) => assign(Object.create(proto), ...assignList),
	//hasOwn = (obj, prop) => obj.hasOwnProperty(prop),
	//define = (obj, value = null, { prop = '', enumerable = true, configurable = false, writable = false, get, set } = {}) => {
	//	prop = prop || value.name;
	//	return hasOwn(obj, prop) ? value :
	//		Object.defineProperty(obj, prop, assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable }));
	//},
	//register = (obj, { prop, value, func, def, enumerable = true, configurable = false, writable = false, get, set } = {}) => {
	//	prop = prop || (value || func).name
	//	if (value && func) value.func = func
	//	else if (func) {
	//		const _func = {
	//			[prop]: function (...args) { log(this); return _func[prop].func(this, ...args) }
	//		}
	//		_func[prop].func = func
	//		value = _func[prop]
	//	}
	//	if (obj.__proto__ && !hasOwn(obj.__proto__, prop)) {
	//		!def ? obj.__proto__[prop] = value :
	//			define(obj.__proto__, value, { prop, enumerable, configurable, writable, get, set })
	//	}
	//	return func ? func : value;
	//},
	hasOwn = (() => {
		if (!Object.hasOwnProperty('hasOwn')) {
			Object.defineProperty(Object, 'hasOwn', { value: function hasOwn(prop) { return this.hasOwnProperty(prop) } })
		}
		return (obj, prop) => obj.hasOwn(prop)
	})(),
	define = (() => {
		function define(obj, value = null, { prop = '', enumerable = true, configurable = false, writable = false, get, set } = {}) {
			prop = prop || value.name
			if (!obj.hasOwn(prop)) {
				Object.defineProperty(obj, prop, assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable }))
			}
			return value
		}
		if (!Object.hasOwn('_define')) Object.defineProperty(Object, '_define', { value:
			function _define(value = null, { prop = '', enumerable = true, configurable = false, writable = false, get, set } = {}) { return define(this, ...arguments) }
			})
		return define
	})(),
	register = (() => {
		function register(obj, { prop, value, func, def, enumerable = true, configurable = false, writable = false, get, set } = {}) {
			prop = prop || (value || func).name
			if (value && func) value.func = func
			else if (func) {
				const _func = {
					[prop]: function (...args) { log(this); return _func[prop].func(this, ...args) }
				}
				_func[prop].func = func
				value = _func[prop]
			}
			if (obj.__proto__ && !hasOwn(obj.__proto__, prop)) {
				!def ? obj.__proto__[prop] = value :
					obj.__proto__._define(value, { prop, enumerable, configurable, writable, get, set })
			}
			return func ? func : value;
		}
		if (!Object.hasOwn('register')) Object._define(
			function _register({ prop, value, func, def, enumerable = true, configurable = false, writable = false, get, set } = {}) { return register(this, ...arguments) }
		)
		return register
	})(),
	getProto = (obj, i = 0) => protoList(obj)[i],
	protoList = (function (obj) {
		const proto = obj.__proto__;
		this.objProto = this.objProto || proto;
		this.protoList = this.protoList || [];
		if (proto) {
			this.protoList.push(proto);
			protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const _protoList = this.protoList;
			this.objProto = null;
			this.protoList = [];
			return _protoList;
		}
	}).bind({}),
	empty = obj => (isObject(obj) ? keys(obj) : obj).length == 0,
	filter = Object.filter = (obj, cb) => fromEntries(entries(obj).filter(cb)),
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
	searchFile = function (path, search, { json = true, parent = true, _cwd = true } = {}) {
		return call(function (path, search, { json = true, parent = true, _cwd = true } = {}) {
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

			const func = function (obj) {
				log('this:', this);
				log('obj:', obj);
			};

			register(Object, { func: func });
			register(Object, {
				func: function func2(obj) {
					log('this:', this);
					log('obj:', obj);
				}
			});

			const obj = define(Object, func, { prop: 'fn' }),
				obj2 = Object.create(Object), // return {} => __proto__ = obj
				obj3 = new Object(Object), // return obj => __proto__ = obj.__proto__
				obj4 = Object.create(obj),
				obj5 = new Object(obj);

			log('Object:', Object);
			log('protoList-Object:', protoList(Object));

			log('obj:', obj);
			log('protoList-obj-define:', protoList(obj));

			log('obj2:', obj2);
			log('protoList-obj2-Object.create(Object):', protoList(obj2));

			log('obj3:', obj3);
			log('protoList-obj3-new Object(Object):', protoList(obj3));

			log('obj4:', obj4);
			log('protoList-obj4-Object.create(obj):', protoList(obj4));

			log('obj5:', obj5);
			log('protoList-obj5-new Object(obj):', protoList(obj5));

			log('protoList-{}:', protoList({}));
			log('protoList-{}:', protoList([]));
			log('protoList-Object:', protoList(Object));
			log('protoList-Array:', protoList(Array));
			log('protoList-Function:', protoList(Function));
			log('protoList-() => { }:', protoList(() => { }));
			log('protoList-searchFile:', protoList(searchFile));

			Object.func();
			Object.func2();

			return fromEntries(configList);
		});
	};

export default {
	imports, importModules,
	INIT_CWD, cwd, argv, parseArgs, args,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, isObject, isFunc, hasOwn, register, define,
	empty, filter, concat, slice, bind, getBind, setBind, call,
	_dirname, _relative, fileName, isDir, isFile,
	getFolders, getFiles,
	config, project, context, runInContext, searchFile, assignConfig
};
