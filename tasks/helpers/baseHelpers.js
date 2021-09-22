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
	{ assign, keys, values, fromEntries, entries, getPrototypeOf } = Object,
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
		const proto = obj.__proto__;
		this.objProto = this.objProto || proto;
		this.protoList = this.protoList || [];
		if (proto) {
			this.protoList.push(proto);
			_protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const protoList = this.protoList;
			this.objProto = null;
			this.protoList = [];
			return protoList;
		}
	}).bind({}),
	getProto = (obj, i = 0) => protoList(obj, i),
	hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
	define = (obj, prop = '', value = null, { enumerable = true, configurable = false, writable = false, get, set } = {}) => {
		const descDefault = { enumerable, configurable },
			desc = assign(descDefault, value ? { value, writable } : { get, set });
		return hasOwn(obj, prop) ? value : Object.defineProperty(obj, prop, desc);
	},
	register = function (obj, prop, value, { enumerable = true, configurable = false, _value, writable = false, get, set } = {}) {
		log('value:', value);
		log('_value:', _value);
		if (isFunc(_value)) value = value.bind(_value);
		log('value():', value());
		!obj.__proto__ || hasOwn(obj.__proto__, prop) ? value : obj.__proto__[prop] = value;
		if (arguments.length > 3) define(obj, `${prop}Define`, _value ? _value : value, { enumerable, configurable, writable, get, set });
		return value;
	},
	empty = obj => (isObject ? keys(obj) : obj).length == 0,
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

			const func = function () { log('this:', this) };

			//log('protoList-Object:', protoList(Object));
			//log('protoList-searchFile:', protoList(searchFile));

			//register(Object, '_my_func', func);
			//register(searchFile, 'func', func);
			register(Object, 'funcBind', function () { log('bind:', this); log('isFunc(this):', isFunc(this)); }, { _value: func });

			//log('protoList-{}:', protoList({}));
			//log('protoList-Object:', protoList(Object));
			//log('protoList-Array:', protoList(Array));
			//log('protoList-Function:', protoList(Function));
			//log('protoList-searchFile:', protoList(searchFile));
			//log('protoList-() => { }:', protoList(() => { }));

			const obj0 = { func0: func },
				obj = define(Object, 'fn', func),
				obj2 = define(Object),
				obj3 = Object.create(obj), // return {} => __proto__ = obj
				obj4 = new Object(obj), // return obj => __proto__ = obj.__proto__
				obj5 = Object.create(obj0),
				obj6 = new Object(obj0),
				obj7 = Object.create(obj3),
				obj8 = new Object(obj3),
				obj9 = Object.create(obj4),
				obj10 = new Object(obj4);

			register(obj5, 'func5', function () { log('func5:', this); });
			register(obj7, 'func7', function () { log('func7:', this); });

			log('obj:', obj);
			log('protoList-obj:', protoList(obj));

			log('obj2:', obj2);
			log('protoList-obj2:', protoList(obj2));

			log('obj3:', obj3);
			log('protoList-obj3-Object.create(Object):', protoList(obj3));

			log('obj4:', obj4);
			log('protoList-obj4-new Object(Object):', protoList(obj4));

			//register(obj3, 'func3', func);
			//register(obj4, 'func4', func);

			//log('protoList-{}:', protoList({}));
			//log('protoList-Object:', protoList(Object));
			//log('protoList-Array:', protoList(Array));
			//log('protoList-Function:', protoList(Function));
			//log('protoList-searchFile:', protoList(searchFile));
			//log('protoList-() => { }:', protoList(() => { }));

			//log('protoList-obj3-Object.create(Object):', protoList(obj3));
			//log('protoList-obj4-new Object(Object):', protoList(obj4));

			//log('obj0:', obj0);
			//log('protoList-obj0:', protoList(obj0));

			log('obj5:', obj5);
			log('protoList-obj5-Object.create(obj0):', protoList(obj5));

			//log('obj6:', obj6);
			//log('protoList-obj6-new Object(obj0):', protoList(obj6));

			log('obj7:', obj7);
			log('protoList-obj7-Object.create(obj3):', protoList(obj7));

			//log('obj8:', obj8);
			//log('protoList-obj8-new Object(obj3):', protoList(obj8));

			//log('obj9:', obj9);
			//log('protoList-obj9-Object.create(obj4):', protoList(obj9));

			//log('obj10:', obj10);
			//log('protoList-obj10-new Object(obj4):', protoList(obj10));

			//const obj11 = assign(obj3, obj0);

			//log('obj11:', obj11);
			//log('protoList-obj11-assign(obj3, obj0):', protoList(obj11));

			//const obj12 = assign(obj4, obj0);

			//log('obj12:', obj12);
			//log('protoList-obj12-assign(obj4, obj0):', protoList(obj12));

			const obj13 = Object.create(obj3);

			register(obj13, 'func13', function () { log('func13:', this); });

			log('obj13:', obj13);
			log('protoList-obj13-Object.create(obj3):', protoList(obj13));

			//const obj14 = Object.create(obj4);

			//log('obj14:', obj14);
			//log('protoList-obj14-Object.create(obj4):', protoList(obj14));

			
			log('Object:', Object);
			log('protoList-Object:', protoList(Object));
			log('protoList-Function:', protoList(Function));
			log('protoList-{}:', protoList({}));

			log('obj4:', obj4);
			log('protoList-obj4:', protoList(obj4));
			log('obj14:', obj14);
			log('protoList-obj14:', protoList(obj14));

			//log('typeof {}:', typeof {});
			//log('typeof obj14:', typeof obj14);
			//obj14.func();
			Object.funcBind();
			obj4.funcBind();
			obj14.funcBind();

			//log('isFunc:', isFunc(func));

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
