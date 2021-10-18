import { pathToFileURL as toUrl } from 'url';
import config from './config.js';
import bh, { log, context, project, configList, from } from './baseHelpers.js';
import dh, { dom, document, nodeList, html, htmlEl } from './domHelpers.js';

const { argv } = bh,
	{
		helpers = [], tasksPath, excludeTasks, root, useWebpack, esModule,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile },
			path: { join },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config;

const h = {
	get tasks() { return process.node_tasks = process.node_tasks ?? tasksPath.importModules(excludeTasks); },
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
		const _esModule = esModule || !exist(tsconfig) ? 'es5' : JSON.parse(readFile(tsconfig)).compilerOptions.module;
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

export default h.setBind(h.setMode).assignDefine(bh, dh);

log('h:', h);

log({}.setBinding);

const proto = {}.unregister(...helpers);

log('proto:', proto);
log('props:', proto.getProps());

'configList:'.log(configList);

'project:'.log(project);
'context:'.log(context);

//log('from:', from(new Map([[0, '1'], [1, '2']])));
//log('from:', from({ 0: '1', 1: '2' }));
//log('reverse:', { 0: '1', 1: '2' }.reverse());
//log('reverse:', new Map([[0, '1'], [1, '2']]).reverse());
//log('fromEntries:', [['1', '2'], ['0', '1']].fromEntries());

log('document:', document);
//log('location:', document.location);

log('nodeList:', nodeList);
log('html:', html);
log('htmlEl:', htmlEl);
