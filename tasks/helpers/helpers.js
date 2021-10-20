import { pathToFileURL as toUrl } from 'url';
import config, { configList, project, context, root } from './config.js';
import bh, { argv, log, from } from './baseHelpers.js';
import dh, { window, document, dom, nodeList, html, htmlEl } from './domHelpers.js';

export { configList, project, context, root, argv, log, from, window, document, dom, nodeList, html, htmlEl };

const {
	helpers, useWebpack, esModule, webpackConfig, tsconfig,
	modules: {
		gulp: { lastRun },
		fs: { existsSync: exist },
		gutil, notify, plumber
	}
} = config;

export const { JSDOM, create, filter, clearClasses, getAll, getStyles, get, addEvent, setHtml, getRect } = dh;

export const {
	nullProto, objProto, arrProto, INIT_CWD, cwd, parseArgs, args,
	createObj, createAssign, hasOwn, define, getPrototype, register, filterEntries, registerAll, addRegister, unregister,
	imports, importModules, error: errorMsg,
	assign, keys, values, fromEntries, entries, getPrototypeOf, getOwnPropertyNames, isArray,
	funcName, is, isObject, isFunc,
	getProps, getProto, protoList, forEach, defineAll, getDesc, assignDefine,
	toJson, isJson, jsonParse, empty, filter: filterObj, filterIn, filterWithout, concat, slice, $delete, reverse, renameKeys,
	dirname, relative, fileName, isDir, isFile, getFolders, getFiles,
	callThis, bind, getBind, setBind, callBind,
	runInContext, searchFile, assignParentFiles, assignRootFiles, assignFiles, setBinding
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
			replace = _esModule.replace(new RegExp(search), ''),
			esNext = replace.toLowerCase() === 'next',
			higher5 = Number(replace) >= 6,
			higher2014 = Number(replace) >= 2015;
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

export default filterIn(h.setBind(h.setMode).assignDefine(bh, dh, { configList }), helpers);

const { lastRun: _lastRun, notify: _notify } = h;
export { _lastRun as lastRun, _notify as notify };
export const { relativeRoot, setMode, setModeSync, currTask, error } = h;

log('h:', h);

//({}).unregister(...keys(filterWithout(h, helpers)));
({}).unregister();

log({}.setBinding);

const proto = {}.unregister('setBinding');

log('proto:', proto);
log('props:', proto.getProps());

log('from:', from(new Map([[0, '1'], [1, '2']])));
log('from:', from({ 0: '1', 1: '2' }));
log('reverse:', { 0: '1', 1: '2' }.reverse());
log('reverse:', new Map([[0, '1'], [1, '2']]).reverse());
log('fromEntries:', [['1', '2'], ['0', '1']].fromEntries());

log('document:', document);
log('location:', document.location);

log('nodeList:', nodeList);
log('html:', html);
log('htmlEl:', htmlEl);

'project:'.log(project);
'context:'.log(context);
