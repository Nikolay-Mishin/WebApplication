import { log } from 'console';
import { fileURLToPath as toPath } from 'url';
import { existsSync as exist, readdirSync as readDir, statSync as stat } from 'fs';
import { join, dirname, relative, basename as base, extname as ext } from 'path';
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
		return function register(obj, value, { prop, def, enumerable = false, configurable = false, writable = false, get, set } = {}) {
			[obj, value] = [obj.__proto__, getFunc(value)];
			prop = prop ?? funcName(value);

			const func = value,
				_func = {
					[prop]: function (...args) { return _func[prop].func(this, ...args); }
				};
			_func[prop].func = value;
			value = _func[prop];
			
			writable = obj === nullProto;
			!(def || writable) ? obj[prop] = value :
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
	log, imports, importModules, assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, from, isObject, isFunc,
	function jsonParse(item) {
		try {
			item = JSON.parse(item);
		}
		catch (e) {
			return null;
		}
		return item;
	},
	function isJson(item) {
		return item.jsonParse() ? true : false;
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
	function $delete(obj, ...keys) { keys.forEach(key => delete obj[key]); },
	function renameKeys(obj, { keyList, pattern = '^_|\W', replace = '' } = {}) {
		log('obj\n', obj);
		log('search:', pattern);
		log('replace:', replace);
		log('keyList:', keyList);
		log('slice:', arguments.slice(1));
		keyList = keyList ?? arguments.slice(1);
		const newKeys = keyList.map((key, i) => {
			log('key', key);
			log('replace', key.replace);
			log(key.replace(new RegExp(pattern), replace));
			key = key.replace(new RegExp(pattern), replace);
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
	function fileName(file) { return base(file, ext(file)); },
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
	jsonParse, isJson, forEach, getProto, protoList, defineAll, getDesc, assignDefine,
	$delete, renameKeys, empty, reverse, _filter: filter, concat, slice, bind, getBind, setBind, callBind,
	fileName, isDir, isFile, getFolders, getFiles
} = h;
const { _dirname, _relative } = h;
export { _dirname as dirname, _relative as relative };

[h.filter, h.dirname, h.relative] = [h._filter, h._dirname, h._relative];

const newKeys = renameKeys(h, '_filter', '_dirname', '_relative');

log('newKeys:', newKeys);

//log('h\n', h);

export default {
	imports, importModules,
	assign, keys, values, fromEntries, entries, getPrototypeOf, isArray, isObject, isFunc,
	create, createAssign, hasOwn, define, register, registerAll
}.assignDefine(h);
