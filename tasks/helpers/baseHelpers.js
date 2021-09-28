import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import { existsSync as exist, readFileSync as readFile, readdirSync as readDir, statSync as stat } from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
import { imports, importModules } from './import.js';

const nullProto = {}.__proto__,
	getFunc = func => func[keys(func).shift()] || func,
	funcName = func => func.name.replace('bound ', '').trim(),
	is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj);

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
	{ isArray, from } = Array,
	isObject = Object.isObject || (Object.isObject = obj => is(Object, obj)),
	isFunc = Function.isFunc || (Function.isFunc = obj => is(Function, obj)),
	create = (proto = Object, ...assignList) => assign(Object.create(proto), ...assignList),
	hasOwn = (() => {
		if (!nullProto.hasOwnProperty('hasOwn')) {
			Object.defineProperty(nullProto, 'hasOwn', { value: function hasOwn(prop) { return this.hasOwnProperty(prop); } });
		}
		return (obj, prop) => obj.hasOwn(prop);
	})(),
	define = (() => {
		if (!nullProto.hasOwn('_define')) Object.defineProperty(nullProto, '_define', {
			value:
				function _define(value = null, { prop = '', enumerable = false, configurable = false, writable = false, get, set } = {}) { return define(this, ...arguments); }
		})
		return function define(obj, value = null, { prop = '', enumerable = false, configurable = false, writable = false, get, set } = {}) {
			prop = prop || value.name;
			if (!obj.hasOwn(prop)) {
				const desc = assign({ enumerable, configurable }, get || set ? { get, set } : { value, writable });
				Object.defineProperty(obj, prop, desc);
			}
			return value;
		};
	})(),
	register = (() => {
		nullProto._define(
			function _register({ prop, value, func, def, enumerable = false, configurable = false, writable = false, get, set } = {}) { return register(this, ...arguments); }
		);
		return function register(obj, value, { prop, func, def, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			[obj, value] = [obj.__proto__, getFunc(value)];
			prop = prop || funcName(value);
			if (func) value.func = func;
			else {
				const _func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args); }
				};
				_func[prop].func = value;
				func = value;
				value = _func[prop];
			}
			!(def || obj === nullProto) ? obj[prop] = value :
				obj._define(value, { prop, enumerable, configurable, writable, get, set });
			return func;
		};
	})(),
	registerAll = (() => ({})._register(function registerAll(obj, ...funcList) {
		return fromEntries(funcList.map(func => {
			const { value, opts } = func;
			func = getFunc(value || func);
			return [funcName(func), obj._register(func, opts || {})];
		}));
	}))(),
	defineAll = (() => ({})._register(function defineAll(obj, desc) { return Object.defineProperties(obj, desc) }))(),
	getDesc = (() => ({})._register(function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) }))(),
	// Такой вариант функции присваивания позволяет копировать методы доступа.
	assignDefine = (() => ({})._register(function assignDefine(target, ...sources) {
		sources.forEach(source => target.defineAll(fromEntries(keys(source).map(key => [key, {}.getDesc.call(source, key)]))));
		const helpers = ({}).registerAll(
			{ getProto2(obj = Object, i = 0) { return protoList(obj)[i]; } },
			(function protoList2(obj = Object) {
				if (!this) return protoList.call({}, obj);
				const proto = obj ? obj.__proto__ : null;
				this.objProto = this.objProto || proto;
				this._protoList = this._protoList || [];
				if (proto) {
					this._protoList.push(proto);
					protoList.call(this, proto);
				}
				if (proto == this.objProto) {
					const _protoList = this._protoList;
					this.objProto = null;
					this._protoList = [];
					return _protoList;
				}
			}).bind({})
		);
		log('protoList:', protoList());
		return target;
	}))(),
	getProto = ({})._register({ getProto(obj = Object, i = 0) { return protoList(obj)[i]; } }),
	protoList = ({})._register(function protoList(obj = Object) {
		if (!this) return protoList.call({}, obj);
		const proto = obj ? obj.__proto__ : null;
		this.objProto = this.objProto || proto;
		this._protoList = this._protoList || [];
		if (proto) {
			this._protoList.push(proto);
			protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const _protoList = this._protoList;
			this.objProto = null;
			this._protoList = [];
			return _protoList;
		}
	}),
	empty = obj => (isObject(obj) ? keys(obj) : obj).length == 0,
	reverse = obj => from(obj).reverse(),
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
	assignConfig = function (path, ...configList) { return callBind({}, arguments, function (path, ...configList) {
		configList = concat(configList).map(config => [fileName(config), searchFile(path, config)]);
		//log('this-assignConfig:', this);
		//log('searchFile:', searchFile);
		//log('searchFile:', configList);

		const func1 = function (obj) {
			log('this:', this);
			log('obj:', obj);
		};

		register(Object, func1);
		register(Object, function func2(obj) {
			log('this:', this);
			log('obj:', obj);
		});

		const obj = define(Object, func1, { prop: 'fn' }),
			obj2 = Object.create(Object), // return {} => __proto__ = obj
			obj3 = new Object(Object), // return obj => __proto__ = obj.__proto__
			obj4 = Object.create(obj),
			obj5 = new Object(obj);

		//log('Object:', Object);
		//log('protoList-Object:', protoList(Object));

		//log('obj:', obj);
		//log('protoList-obj-define:', protoList(obj));

		//log('obj2:', obj2);
		//log('protoList-obj2-Object.create(Object):', protoList(obj2));

		//log('obj3:', obj3);
		//log('protoList-obj3-new Object(Object):', protoList(obj3));

		//log('obj4:', obj4);
		//log('protoList-obj4-Object.create(obj):', protoList(obj4));

		//log('obj5:', obj5);
		//log('protoList-obj5-new Object(obj):', protoList(obj5));

		//log('protoList-{}:', protoList({}));
		//log('protoList-{}:', protoList([]));
		//log('protoList-Object:', protoList(Object));
		//log('protoList-Array:', protoList(Array));
		//log('protoList-Function:', protoList(Function));
		//log('protoList-() => { }:', protoList(() => { }));
		//log('protoList-searchFile:', protoList(searchFile));

		//Object.func();
		//Object.func2();

		return fromEntries(configList);
	}); };

//log('helpers\n', helpers);

export default {
	imports, importModules,
	INIT_CWD, cwd, argv, parseArgs, args,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, isObject, isFunc,
	create, nullProto, hasOwn, register, define, defineAll, getDesc, assignDefine, getProto, protoList,
	empty, reverse, filter, concat, slice, bind, getBind, setBind, call, callBind,
	_dirname, _relative, fileName, isDir, isFile, getFolders, getFiles,
	project, context, runInContext, searchFile, assignConfig
};
