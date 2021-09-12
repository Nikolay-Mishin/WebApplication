const { log } = console,
	{ argv: _argv, cwd } = process,
	argv = _argv.slice(2),
	config = require('../../gulpfile.config'),
	{
		root, useWebpack, esModule, tasksPath, excludeTasks = [],
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat },
			path: { join, relative, basename: base, extname: ext, sep },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config,
	relativeRoot = from => _relative(from, root),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFiles = (path, exclude = []) => {
		return readDir(path).filter(file => ext(join(path, file)) !== '' && !exclude.includes(fileName(file)))
	},
	parseArgs = (argList, assign = {}, sep = '^\-+') => {
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
		return Object.assign(assign, args);
	};

function getContext(name) {
	let _argv = argv[0] || argv[1];
	if (typeof _argv !== 'undefined' && _argv.indexOf('--') < 0) _argv = argv[1];
	return (typeof _argv === 'undefined') ? name : _argv.replace('--', '');
}

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

module.exports = {
	relativeRoot, fileName, isDir, isFile, getFiles, parseArgs, getContext, options, runInContext,
	get config() { return process.node_config; },
	set config(value) { process.node_config[name = Object.keys(value)[0]] = value[name]; },
	get modules() { return this.config.modules; },
	get tasks() { return process.node_tasks; },
	get webpackConfig() {
		return !(exist(wc = webpackConfig) && this.getMode) ? {} : (this.config = { webpackConfig: require(wc) }).webpackConfig;
	},
	get useWebpack() {
		const _esModule = esModule || !exist(ts = tsconfig) ? 'es5' : JSON.parse(readFile(ts)).compilerOptions.module;
		if (_useWebpack = useWebpack || this.config.useWebpack) return _useWebpack;
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
	tasksList: (() => getFiles(tasksPath, excludeTasks))(),
	args: (argList => parseArgs(argList))(argv),
	currTask: (argList => argList.filter(arg => !(/^\-+/.test(arg) || isDir(arg) || isFile(arg)))[0] || null)(argv),
	// filtered = Object.filter(scores, ([key, value]) => value > 1);
	filter: Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate)),
	getContext, options, runInContext,
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
