import { argv } from 'process';
import { fileURLToPath as toPath, pathToFileURL as toUrl } from 'url';
import config from '../../gulpfile.config.js';
const {
		root, useWebpack, esModule,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir },
			path: { join, dirname, relative, basename: base, extname: ext },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config,
	__dirname = meta => dirname(toPath(meta.url)),
	_relative = (from, to) => relative(from.url ? __dirname(from) : from, to),
	relativeRoot = from => _relative(from, root),
	fileName = file => base(file, ext(file));

const helpers = {
	__dirname, _relative, relativeRoot,
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
	get dev() { return (this.getMode.trim().toLowerCase() || this.setModeSync()) === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV; },
	setMode: (prod = false) => async () => this.setModeSync(prod),
	setModeSync: (prod = false) => process.env.NODE_ENV = prod ? 'production' : 'development',
	fileName,
	getFiles: (_path, exclude = []) => readDir(_path).filter(file => ext(file) !== '' && !exclude.includes(fileName(file))),
	arg: (argList => {
		let args = {}, opt, thisOpt, curOpt;
		argList.forEach(arg => {
			thisOpt = arg.trim();
			opt = thisOpt.replace(/^\-+/, '');
			if (thisOpt === opt) {
				if (curOpt) args[curOpt] = opt; // argument value
				curOpt = null;
			}
			else args[curOpt = opt] = true; // argument name
		});
		return args;
	})(argv),
	currTask: (argList => argList[argList.length - 1])(argv),
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

export default helpers;
