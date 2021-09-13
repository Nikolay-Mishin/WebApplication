import { log } from 'console';
import { cwd, argv as _argv } from 'process';
import { fileURLToPath as toPath, pathToFileURL as toUrl } from 'url';
import config from '../../gulpfile.config.js';
const argv = _argv.slice(2),
	{
		root, useWebpack, esModule, tasksPath, excludeTasks = [], helpers: _helpers,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat },
			path: { join, dirname, relative, basename: base, extname: ext, sep },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config,
	_dirname = meta => dirname(toPath(meta.url)),
	_relative = (from, to) => relative(from.url ? _dirname(from) : from, to),
	relativeRoot = from => _relative(from, root),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFiles = (path, { exclude = [], nonExt = false } = opts) => {
		return readDir(path).filter(file => ext(join(path, file)) !== '' && !exclude.includes(fileName(file)))
			.reduce((accumulator, file, i, files) => { files[i] = nonExt ? file.replace('.js', '') : file; return files; }, 0);
	};
//parseArgs = (argList, assign = {}, sep = '^\-+') => {
//	let args = {}, opt, thisOpt, curOpt;
//	argList.forEach(arg => {
//		thisOpt = arg.trim();
//		opt = thisOpt.replace(new RegExp(sep), '');
//		if (thisOpt === opt) {
//			if (curOpt) args[curOpt] = opt; // argument value
//			curOpt = null;
//		}
//		else args[curOpt = opt] = true; // argument name
//	});
//	return Object.assign(assign, args);
//};

//function getContext(name) {
//	let _argv = argv[0] || argv[1];
//	if (typeof _argv !== 'undefined' && _argv.indexOf('--') < 0) _argv = argv[1];
//	return (typeof _argv === 'undefined') ? name : _argv.replace('--', '');
//}

const options = {
	project: 'app-' + getContext('canonium')
};

function runInContext(path, cb) {
	const context = relative(cwd(), path),
		project = context.split(sep)[0];

	//console.log(
	//	'[' + chalk.green(project.replace('app-', '')) + ']' +
	//	' has been changed: ' + chalk.cyan(context)
	//);
	log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);

	options.project = project; // Set project

	cb(); // Task call

	// Example
	//gulp.watch('app-*/templates/*.jade').on('change', function (file) {
	//	runInContext(file, gulp.series('jade'));
	//});
}

const helpers = {
	_dirname, _relative, relativeRoot, fileName, isDir, isFile, getFiles, /*parseArgs, getContext, */options, runInContext,
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
	tasksList: (() => getFiles(tasksPath, { excludeTasks, nonExt: true }))(),
	//args: (argList => parseArgs(argList))(argv),
	currTask: (argList => argList.filter(arg => !(/^\-+/.test(arg) || isDir(arg) || isFile(arg)))[0] || null)(argv),
	// filtered = Object.filter(scores, ([key, value]) => value > 1);
	filter: Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate)),
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

Object.assign(helpers, _helpers);

export default helpers;
