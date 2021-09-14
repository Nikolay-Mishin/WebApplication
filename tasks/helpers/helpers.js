import { log } from 'console';
import { pathToFileURL as toUrl } from 'url';
import config from '../../gulpfile.config.js';
import h from './baseHelpers.js';

const { argv, _relative, isDir, isFile, getFiles } = h,
	{
		root, useWebpack, esModule, tasksPath, excludeTasks = [], helpers: _helpers,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile },
			path: { join },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config,
	relativeRoot = from => _relative(from, root);

const helpers = {
	relativeRoot,
	get config() { return process.node_config; },
	set config(value) {
		const name = Object.keys(value)[0];
		process.node_config[name] = value[name];
	},
	get modules() { return this.config.modules; },
	get tasks() { return process.node_tasks; },
	get webpackConfig() {
		return (async () => !(exist(webpackConfig) && this.getMode) ? {} :
			(this.config = { webpackConfig: (await import(toUrl(webpackConfig))).default }).webpackConfig)();
	},
	get useWebpack() {
		const _esModule = esModule || !exist(tsconfig) ? 'es5' : JSON.parse(readFile(tsconfig)).compilerOptions.module;
		if (useWebpack || this.config.useWebpack) return useWebpack || this.config.useWebpack;
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
	setMode: (prod = false) => async () => this.setModeSync(prod),
	setModeSync: (prod = false) => process.env.NODE_ENV = prod ? 'production' : 'development',
	tasksList: (() => getFiles(tasksPath, { exclude: excludeTasks, nonExt: true }))(),
	currTask: (argList => argList.filter(arg => !(/^\-+/.test(arg) || isDir(arg) || isFile(arg)))[0] || null)(argv),
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

Object.assign(helpers, h);

export default helpers;
