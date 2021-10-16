import { log } from 'console';
import { env, cwd as $cwd, argv as $argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import {
	existsSync as exist, readdirSync as readDir, statSync as stat, readFileSync as readFile, writeFileSync as writeFile
} from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
import { Buffer } from 'buffer';
import { imports, importModules } from './import.js';

export { log, imports, importModules };

const getFunc = func => func[keys(func).shift()] ?? func;

export const error = msg => { throw new Error(msg) },
	{ assign, keys, values, fromEntries, entries, getPrototypeOf } = Object,
	{ isArray, from } = Array,
	funcName = func => func.name.replace('bound ', '').trim(),
	is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj),
	isObject = obj => is(Object, obj),
	isFunc = obj => is(Function, obj);

export const nullProto = {}.__proto__,
	objProto = Object.prototype,
	arrProto = Array.prototype,
	{ INIT_CWD } = env,
	cwd = $cwd(),
	argv = $argv.slice(2),
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
	// return {} => __proto__ = obj
	// new Object(obj) - return obj => __proto__ = obj.__proto__
	createObj = (proto = Object, props) => Object.create(proto, props),
	createAssign = (proto = Object, ...assignList) => assign(createObj(proto), ...assignList),
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
			function _register({ prop, value, def, enumerable = false, configurable = false, writable = false, get, set } = {}) { return register(this, ...arguments); }
		);
		return function register(obj, value, { prop, def = false, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			const proto = obj.prototype ?? obj.__proto__;
			[value, prop] = [getFunc(value), prop ?? funcName(value)];

			const func = value,
				_func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args); }
				};
			_func[prop].func = value;
			value = _func[prop];

			(def ? obj : proto)._define(value,
				{ prop, enumerable, configurable, writable: writable || proto === nullProto, get, set });

			return func;
		};
	})(),
	filterEntries = (() => ({})._register(function filterEntries(obj, cb = null) {
		return obj.filter(cb ?? (file => file[1] != null));
	}))(),
	registerAll = (() => ({})._register(function registerAll(helpers = []) {
		const funcList = {}.registerAll.funcList.map(([func, opts]) => {
			return helpers.length === 0 || helpers.includes(opts.name) ? [opts.name, opts.obj._register(func, opts)] : null;
		});
		({}).registerAll.funcList = [];
		log('registerAll:', fromEntries(funcList.filterEntries()));
		return fromEntries(funcList.filterEntries());
	}))(),
	addRegister = (() => ({})._register(function addRegister(obj, ...funcList) {
		({}).registerAll.funcList = {}.registerAll.funcList ?? [];
		//log('funcList:', {}.registerAll.funcList);
		const funcs = {};
		({}).registerAll.funcList = {}.registerAll.funcList.concat(funcList.map(func => {
			let value, opts;
			isArray(func) ? [value, opts = {}] = func : { value, opts = {} } = func;
			funcs[opts.name = funcName(func = getFunc(value ?? func))] = func;
			opts.obj = obj
			return [func, opts];
		}));
		//log('funcList:', {}.registerAll.funcList);
		//log('funcs:', funcs);
		return funcs;
	}))();

const h = {}.addRegister(
	log, imports, importModules, [error, { prop: 'errorMsg' }],
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, from,
	funcName, is, isObject, isFunc,
	function getProto(obj = Object, i = 0) { return obj.protoList()[i]; },
	(function protoList(obj = Object) {
		const proto = obj.prototype ?? obj.__proto__;
		if (proto) {
			this.objProto = this.objProto ?? proto;
			this._protoList = this._protoList ?? [];
			this._protoList.push(proto);
			protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const _protoList = this._protoList;
			[this.objProto, this._protoList] = [null, []];
			return _protoList;
		}
	}).bind({}),
	function forEach(obj, cb) { for (let key in obj) cb(obj[key], key); },
	function defineAll(obj, desc) { return Object.defineProperties(obj, desc) },
	function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) },
	// Такой вариант функции присваивания позволяет копировать методы доступа
	function assignDefine(target, ...sources) {
		sources.forEach(source => defineAll(target, fromEntries(keys(source).map(key => [key, getDesc(source, key)]))));
		return target;
	},
	function toJson(item, space = null, replacer = null) { return JSON.stringify(item, replacer, space); },
	function isJson(item) { return item.jsonParse() ? true : false; },
	function jsonParse(item) {
		try {
			item = JSON.parse(item);
		}
		catch (e) {
			return null;
		}
		return item;
	},
	function empty(obj) { return (obj.isObject() ? obj.keys() : obj).length == 0; },
	function _filter(obj, cb) { return obj.entries().filter(cb).fromEntries(); },
	function concat(...list) { return [].concat.apply([], ...list); },
	function slice(obj, i = 0) { return [].slice.call(obj, i); },
	function $delete(obj, ...keys) { keys.forEach(key => delete obj[key]); return obj; },
	function reverse(obj, cb = null, $this = obj) {
		const oldLength = obj.length;
		if (!oldLength) obj.length = obj.keys().length;
		obj = obj.isObject() ? [].reverse.call(obj) : from(obj, cb ?? (v => v), $this).reverse();
		if (!oldLength && obj.isObject()) obj.$delete('length');
		return obj;
	},
	function renameKeys(obj, { keyList, searchVal = '^_|\W', replaceVal = '' } = {}) {
		keyList = keyList ?? arguments.slice(1);
		const newKeys = keyList.map((key, i) => {
			key = key.replace(new RegExp(searchVal), replaceVal);
			obj[key] = obj[keyList[i]];
			return key;
		});
		$delete(obj, ...keyList);
		return newKeys;
	}
);

export const {
	getProto, protoList, forEach, defineAll, getDesc, assignDefine,
	toJson, isJson, jsonParse, empty, _filter: filter, concat, slice, $delete, reverse, renameKeys
} = h;

const fs = {}.addRegister(
	function _dirname(meta) { return dirname(toPath(meta.url)); },
	function _relative(from, to) { return relative(from.url ? from._dirname() : from, to); },
	function fileName(f, info = false) {
		return !info ? base(f, ext(f)) : { file: f, name: base(f, ext(f)), ext: ext(f).replace(new RegExp('^\.'), '') };
	},
	function isDir(path) { return exist(path) && stat(path).isDirectory(); },
	function isFile(path) { return exist(path) && stat(path).isFile(); },
	function getFolders(path, { exclude = [] } = {}) {
		return readDir(path).filter(f => join(path, f).isDir() && !exclude.includes(f));
	},
	function getFiles(path, { exclude = [], nonExt = false } = {}) {
		return readDir(path)
			.filter(file => join(path, file).isFile() && !exclude.includes(nonExt ? file.fileName() : file))
			.map(file => nonExt ? file.replace(ext(file), '') : file);
	}
);

const { _dirname, _relative } = fs;
export { _dirname as dirname, _relative as relative };
export const { fileName, isDir, isFile, getFolders, getFiles } = fs;

const func = {}.addRegister(
	function callThis(context, ...args) { return context.call(context, ...args); },
	function bind(context, ...funcList) { return concat(funcList).map(func => func.bind(context)); },
	function getBind(context, func) { return bind(context, func).shift(); },
	function setBind(context, ...funcList) {
		return context.assign(bind(context, ...funcList)
			.map((func, i) => [funcList[i].name, func]).fromEntries());
	},
	function callBind(context, args, cb) { return cb.call(context, ...args); },
);

export const { callThis, bind, getBind, setBind, callBind } = func;

const { assignParentFiles, assignRootFiles } = {}.addRegister(
	function assignParentFiles(parent) { return parent.entries().map(file => file[1]).reverse(); },
	function assignRootFiles(root, config, parent) {
		return !config.isObject() ? { file: config } : root.assign(...parent.assignParentFiles(), config);
	}
);

const _context = {}.addRegister(
	function runInContext(path, cb) {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	(function searchFile(path, search, parent = true) {
		const filePath = join(path, search),
			_file = path.isDir() && filePath.isFile() ? readFile(filePath) : null,
			result = () => {
				const result = {}.assign(this);
				[this.config, this.root, this.parent] = [null, null, {}];
				return result;
			};
		if (_file) {
			const file = _file.jsonParse() ?? _file,
				info = { path, file };
			this.config = this.config ?? info;
			this.parent = this.parent ?? {};
			if (this.config.path == cwd) return result();
			else if (file.root || path == cwd) {
				this.root = info;
				if (file.root) return result();
			}
			else if (parent && path != this.config.path && !this.parent[path]) {
				this.parent[path] = file;
			}
		}
		return !(parent && path != cwd && path != dirname(path)) ? result() :
			searchFile.call(this, dirname(path), ...from(arguments).slice(1));
	}).bind({}),
	function assignFiles(path, ...files) {
		return files.concat().map(file => {
			const { config, root = {}, parent = {} } = path.searchFile(file);
			return [
				file.fileName(),
				!config ? null :
					{ $path: `${config.path}\\${file}`, $file: file }
						.assign((root?.file ?? {}).assignRootFiles(config.file, parent))
			];
		}).filter(file => file[1] != null).fromEntries();
	},
	function setBinding(path, configFile, packageFile, gulpFile) {
		const configList = path.assignFiles(configFile, packageFile),
			{ config, package: $package } = configList,
			_gulpfile = path.assignFiles($package?.main ?? gulpFile).gulpfile,
			gulpfile = _gulpfile?.file;
		if (_gulpfile) configList.gulpfile = _gulpfile;
		if (config?.binding) {
			const { gulp, npm } = config.binding;
			if (npm && $package) {
				const { name, ext } = $package.$file.fileName(true);
				$package['-vs-binding'] = npm;
				//'$package\n'.log({}.assign($package).$delete('$path', '$file').toJson(4));
				//'npm:'.log(`${name}.${ext}`);
				if (config?.setBinding) writeFile(`${name}.${ext}`, {}.assign($package).$delete('$path', '$file').toJson(4));
			}
			if (gulp && gulpfile) {
				const bindings = gulp.entries().reduce((str, val) => str += ` ${val[0]}='${val[1].join(', ')}'`, '// <binding'),
					exec = new RegExp('// <binding.+ />\r\n').exec(gulpfile) ?? [];
				//'binding:'.log(`${bindings} />`);
				if (exec[0]) {
					const { name, ext } = _gulpfile.$path.fileName(true),
						file = _gulpfile.file = Buffer.from(exec.input = exec.input.replace(exec[0], `${bindings} />\r\n`));
					//'gulpfile:'.log(file);
					//'gulp:'.log(`${name}.${ext}`);
					if (config?.setBinding) writeFile(`${name}.${ext}`, file);
				}
			}
		}
		return configList;
	}
);

export const { runInContext, searchFile, assignFiles, setBinding } = _context;

[].registerAll();

export const configList = setBinding(INIT_CWD, 'config.json', 'package.json', 'gulpfile.js'),
	{ config, package: $package, gulpfile } = configList;

const { helpers = [], paths: { root: $root = './' } } = config;

export const { project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = _projectsPath.isDir(),
			projectsPath = exist ? _projectsPath : cwd,
			projects = projectsPath.getFolders({ exclude })
				.concat(exist ? [] : dirname(projectsPath).getFolders({ exclude })),
			arg = args._filter(([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : arg.keys()[1] ?? (exist && INIT_CWD != cwd ? INIT_CWD : cwd).fileName(),
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
	})(),
	root = join(context, $root),
	relativeRoot = {}._register(function relativeRoot(from) { return from._relative(root); });

renameKeys(h, '_filter');
fs.renameKeys('_dirname', '_relative');

export default {
	nullProto, objProto, arrProto, INIT_CWD, cwd, argv, parseArgs, args,
	createObj, createAssign, hasOwn, define, register, filterEntries, registerAll, addRegister,
	configList, project, context
}.assignDefine(h, fs, func, _context);
