import { log } from 'console';
import { env, cwd as $cwd, argv as $argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import {
	existsSync as exist, readdirSync as readDir, statSync as stat, readFileSync as readFile, writeFileSync as writeFile
} from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
import { Buffer } from 'buffer';
import { imports, importModules } from './import.js';

const nullProto = {}.__proto__,
	getFunc = func => func[keys(func).shift()] ?? func,
	funcName = func => func.name.replace('bound ', '').trim(),
	is = (context, obj) => (function (obj) { return obj != null && obj.constructor === this; }).call(context, obj);

export { imports, importModules };
export const { assign, keys, values, fromEntries, entries, getPrototypeOf } = Object,
	{ isArray, from } = Array,
	isObject = obj => is(Object, obj),
	isFunc = obj => is(Function, obj),
	// return {} => __proto__ = obj
	// new Object(obj) - return obj => __proto__ = obj.__proto__
	create = (proto = Object, props) => Object.create(proto, props),
	createAssign = (proto = Object, ...assignList) => assign(Object.create(proto), ...assignList),
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
			[obj, value] = [obj.__proto__, getFunc(value)];
			prop = prop ?? funcName(value);

			const func = value,
				_func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args); }
				};
			_func[prop].func = value;
			value = _func[prop];
			
			writable = obj === nullProto;
			log('writable:', writable);
			log('def:', !(def || writable));
			//!(def || writable) ? obj[prop] = value :
			obj._define(value, { prop, enumerable, configurable, writable, get, set });
			return func;
		};
	})(),
	registerAll = (() => ({})._register(function registerAll(obj, ...funcList) {
		return fromEntries(funcList.map(func => {
			const { value, opts = {} } = func;
			func = getFunc(value || func);
			return [funcName(func), obj._register(func, opts)];
		}));
	}))(),
	call = (context, ...args) => context.call(context, ...args);

const h = {}.registerAll(
	log, imports, importModules, assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, from,
	isObject, isFunc,
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
	function forEach(obj, cb) { for (let key in obj) cb(obj[key], key); },
	function getProto(obj = Object, i = 0) { return obj.protoList()[i]; },
	(function protoList(obj = Object) {
		const proto = obj.__proto__ ?? null;
		this.objProto = this.objProto ?? proto;
		this._protoList = this._protoList ?? [];
		if (proto) {
			this._protoList.push(proto);
			protoList.call(this, proto);
		}
		if (proto == this.objProto) {
			const _protoList = this._protoList;
			[this.objProto, this._protoList] = [null, []];
			return _protoList;
		}
	}).bind({}),
	function defineAll(obj, desc) { return Object.defineProperties(obj, desc) },
	function getDesc(obj, key) { return Object.getOwnPropertyDescriptor(obj, key) },
	// Такой вариант функции присваивания позволяет копировать методы доступа
	function assignDefine(target, ...sources) {
		sources.forEach(source => defineAll(target, fromEntries(keys(source).map(key => [key, getDesc(source, key)]))));
		return target;
	},
	function $delete(obj, ...keys) { keys.forEach(key => delete obj[key]); return obj; },
	function renameKeys(obj, { keyList, searchVal = '^_|\W', replaceVal = '' } = {}) {
		keyList = keyList ?? arguments.slice(1);
		const newKeys = keyList.map((key, i) => {
			key = key.replace(new RegExp(searchVal), replaceVal);
			obj[key] = obj[keyList[i]];
			return key;
		});
		$delete(obj, ...keyList);
		return newKeys;
	},
	function empty(obj) { return (obj.isObject() ? obj.keys() : obj).length == 0; },
	function reverse(obj) { return obj.from().reverse(); },
	function _filter(obj, cb) { return obj.entries().filter(cb).fromEntries(); },
	function concat(...list) { return [].concat.apply([], ...list); },
	function slice(obj, i = 0) { return [].slice.call(obj, i); },
	function bind(context, ...funcList) { return concat(funcList).map(func => func.bind(context)) },
	function getBind(context, func) { return bind(context, func).shift(); },
	function setBind (context, ...funcList) { return context.assign(bind(context, ...funcList)
		.map((func, i) => [funcList[i].name, func]).fromEntries()); },
	function callBind(context, args, cb) { return cb.call(context, ...args); },
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
	function getFiles(path, { exclude = [], nonExt = false } = {}) { return readDir(path)
		.filter(file => join(path, file).isFile() && !exclude.includes(nonExt ? file.fileName() : file))
		.map(file => nonExt ? file.replace(ext(file), '') : file); }
);

export const {
	toJson, isJson, jsonParse, forEach, getProto, protoList, defineAll, getDesc, assignDefine,
	$delete, renameKeys, empty, reverse, _filter: filter, concat, slice, bind, getBind, setBind, callBind,
	fileName, isDir, isFile, getFolders, getFiles
} = h;
const { _dirname, _relative } = h;
export { _dirname as dirname, _relative as relative };

const newKeys = renameKeys(h, '_filter', '_dirname', '_relative');

const { assignParentFiles, assignRootFiles } = {}.registerAll(
	function assignParentFiles(parent) { return parent.entries().map(file => file[1]).reverse(); },
	function assignRootFiles(root, config, parent) {
		return !config.isObject() ? { file: config } : root.assign(...parent.assignParentFiles(), config);
	}
);

export const { INIT_CWD } = env,
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
	args = (argList => parseArgs(argList))(argv);

const ch = {}.registerAll(
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
			searchFile.call(this, dirname(path), ...arguments.from().slice(1));
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

export const configList = INIT_CWD.setBinding('config.json', 'package.json', 'gulpfile.js'),
	{ config, package: $package } = configList;

const { paths: { root: $root = './' } } = config;

export const { runInContext, searchFile, assignFiles, setBinding } = ch,
	{ project, context } = (() => {
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

export default {
	log, imports, importModules,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, from, isObject, isFunc,
	create, createAssign, hasOwn, define, register, registerAll, call,
	INIT_CWD, cwd, argv, parseArgs, args, configList, project, context
}.assignDefine(h, ch);
