import { pathToFileURL as toUrl } from 'url';
import config, { configList, project, context, projectsPath, projList, root } from './config.js';
import bh, { argv } from './baseHelpers.js';
import dh, { window, document } from './domHelpers.js';

export { configList, project, context, projectsPath, projList, root, argv, window, document };

const {
	helpers, useWebpack, esModule, webpackConfig, tsconfig,
	modules: {
		gulp: { lastRun },
		fs: { existsSync: exist },
		gutil, notify, plumber
	}
} = config;

export const {
	JSDOM, dom, nodeList, html, htmlEl, create,
	filter, clearClasses, getAll, getStyles, get, addEvent, setHtml, getRect
} = dh;

export const {
	log, env, imports, importModules, error: errorMsg,
	nullProto, objProto, arrProto, cwd, INIT_CWD, HOMEDRIVE, title, parseArgs, args,
	createObj, createAssign, hasOwn, define, getPrototype, register, filterEntries, registerAll, addRegister, unregister,
	assign, keys, values, fromEntries, entries, getPrototypeOf, getOwnPropertyNames, equal, isArray, from,
	funcName, is, isObject, isFunc,
	toNum, getProps, getProto, protoList, forEach, defineAll, getDesc, assignDefine,
	toJson, isJson, jsonParse, empty, filter: filterObj, filterWithout, filterIn, includes,
	concat, slice, $delete, reverse, renameKeys,
	dirname, relative, fileName, isDir, isFile, getFolders, getFiles,
	callThis, bind, getBind, setBind, callBind,
	runInContext, searchFile, assignParentFiles, assignRootFiles, assignFiles, setBinding, initProjects
} = bh;

renameKeys(bh, { keyList: ['error'], searchVal: 'error', replaceVal: 'errorMsg' });
renameKeys(bh, { keyList: ['filter'], searchVal: 'filter', replaceVal: 'filterObj' });

const h = {
	relativeRoot: {}._register(function relativeRoot(from) { return from._relative(root); }),
	get tasks() { return process.node_tasks; },
	get modules() { return this.config.modules; },
	get config() { return process.node_config; },
	set config(value) {
		const name = value.keys()[0];
		process.node_config[name] = value[name];
	},
	get webpackConfig() {
		return (async () => !(exist(webpackConfig) && this.getMode) ? {} :
			(this.config = { webpackConfig: (await import(toUrl(webpackConfig))).default }).webpackConfig)();
	},
	get useWebpack() {
		const _esModule = esModule || !tsconfig ? 'es5' : tsconfig?.compilerOptions.module;
		if (useWebpack ?? this.config.useWebpack) return useWebpack ?? this.config.useWebpack;
		const search = 'es',
			includes = _esModule.includes(search),
			replace = _esModule.replace(search, ''),
			esNext = replace.toLowerCase() === 'next',
			higher5 = replace.toNum() >= 6,
			higher2014 = replace.toNum() >= 2015;
		return (this.config = { useWebpack: !includes || esNext || higher5 || higher2014 }).useWebpack;
	},
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return (this.getMode || this.setModeSync()).trim().toLowerCase() === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV; },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync: (prod = false) => process.env.NODE_ENV = prod ? 'production' : 'development',
	currTask: (argList => argList.filter(arg => !(/^\-+/.test(arg) || arg.isDir() || arg.isFile()))[0] ?? null)(argv),
	lastRun: func => { since: lastRun(func) },
	error: err => gutil.log(gutil.colors.red('[Error]'), err.toString()),
	notify: (title, message = 'Scripts Done') => notify({ title: title, message: message }),
	get errorHandler() {
		return plumber({
			errorHandler: notify.onError({
				title: 'Ошибка в плагине <%= error.plugin %>',
				message: "Ошибка: <%= error.message %>"
			})
		});
	}
};

export default filterIn(h.setBind(h.setMode).assignDefine(bh, dh, { configList, project, context }), helpers);

const { lastRun: _lastRun, notify: _notify } = h;
export { _lastRun as lastRun, _notify as notify };
export const { relativeRoot, setMode, setModeSync, currTask, error } = h;
