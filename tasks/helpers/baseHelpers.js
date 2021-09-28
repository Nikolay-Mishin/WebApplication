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
			writable = obj === nullProto;
			!(def || writable) ? obj[prop] = value :
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
	}))();

const helpers = ({}).registerAll(
	function defineAll(obj, desc) { return Object.defineProperties(obj, desc) },
	function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) },
	// Такой вариант функции присваивания позволяет копировать методы доступа
	function assignDefine(target, ...sources) {
		sources.forEach(source => target.defineAll(fromEntries(keys(source).map(key => [key, {}.getDesc.call(source, key)]))));
		return target;
	},
	{ getProto(obj = Object, i = 0) { return protoList(obj)[i]; } },
	(function protoList(obj = Object) {
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
	}).bind({}),
	function empty(obj) { return (isObject(obj) ? keys(obj) : obj).length == 0; },
	function reverse(obj) { return from(obj).reverse(); },
	function _filter(obj, cb) { return fromEntries(entries(obj).filter(cb)); },
	function concat(...list) { return [].concat.apply([], ...list); },
	function slice(obj, i = 0) { return [].slice.call(obj, i); },
	function bind(context, ...funcList) { return concat(funcList).map(func => func.bind(context)); },
	function getBind(context, func) { return bind(context, func).shift(); },
	function setBind (context, ...funcList) { return assign(context, fromEntries(bind(context, ...funcList)
		.map((func, i) => [funcList[i].name, func]))); },
	function call(context, ...args) { return context.call(context, ...args); },
	function callBind(context, args, cb) { return cb.call(context, ...args); },
	function _dirname(meta) { return dirname(toPath(meta.url)); },
	function _relative(from, to) { return relative(from.url ? _dirname(from) : from, to); },
	function fileName(file) { return base(file, ext(file)); },
	function isDir(path) { return exist(path) && stat(path).isDirectory(); },
	function isFile(path) { return exist(path) && stat(path).isFile(); },
	function getFolders(path, {exclude = []}={}) { return readDir(path).filter(f => isDir(join(path, f)) && !exclude.includes(f)); },
	function getFiles(path, { exclude = [], nonExt = false } = {}) { return readDir(path)
		.filter(file => isFile(join(path, file)) && !exclude.includes(nonExt ? fileName(file) : file))
		.map(file => nonExt ? file.replace(ext(file), '') : file); }
);

export const {
	defineAll, getDesc, assignDefine, getProto, protoList,
	empty, reverse, _filter: filter, concat, slice, bind, getBind, setBind, call, callBind,
	_dirname, _relative, fileName, isDir, isFile, getFolders, getFiles
} = helpers;

export const config = !isFile('config.json') ? {} : JSON.parse(readFile('config.json')),
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

const _helpers = {
	imports, importModules,
	INIT_CWD, cwd, argv, parseArgs, args,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, isObject, isFunc,
	create, hasOwn, define, register, registerAll,
	project, context, runInContext, searchFile, assignConfig
}.assignDefine(helpers)

log('_helpers\n', _helpers);

export default _helpers;
