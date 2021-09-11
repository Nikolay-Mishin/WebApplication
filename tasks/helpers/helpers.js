const { argv } = process,
	config = require('../../gulpfile.config'),
	{
		root, useWebpack, esModule,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir },
			path: { join, basename: base, extname: ext },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config,
	relativeRoot = from => relative(from, root),
	fileName = file => base(file, ext(file));

function getDefaultContext(defaultName) {
	let argv = process.argv[2] || process.argv[3];
	if (typeof argv !== 'undefined' && argv.indexOf('--') < 0) argv = process.argv[3];
	return (typeof argv === 'undefined') ? defaultName : argv.replace('--', '');
}

const options = {
	project: 'app-' + getDefaultContext('canonium')
};

function runInContext(filepath, cb) {
	const context = path.relative(process.cwd(), filepath),
		projectName = context.split(path.sep)[0];

	//console.log(
	//	'[' + chalk.green(projectName.replace('app-', '')) + ']' +
	//	' has been changed: ' + chalk.cyan(context)
	//);
	log(`[${projectName.replace('app-', '')}] has been changed:  + ${context}`);

	options.project = projectName; // Set project

	cb(); // Task call

	// Example
	//gulp.watch('app-*/templates/*.jade').on('change', function (filepath) {
	//	runInContext(filepath, gulp.series('jade'));
	//});
}

module.exports = {
	relativeRoot,
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
	get dev() { return (this.getMode.trim().toLowerCase() || this.setModeSync()) === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV; },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	fileName,
	getFiles(_path, exclude = []) {
		return readDir(_path).filter(file => ext(file) !== '' && !exclude.includes(fileName(file)));
	},
	get nodePath() { return this.args.$node; },
	get gulpPath() { return this.args.$gulp; },
	get currTask() { return this.args.$task; },
	get taskArgs() { return this.args.$taskArgs; },
	// filtered = Object.filter(scores, ([name, score]) => score > 1);
	filter: Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate)),
	getDefaultContext, options, runInContext,
	args: (argList => {
		let args = {}, opt, thisOpt, curOpt;
		args.$node = argList[0];
		args.$gulp = argList[1];
		argList = argList.slice(2);
		args.$task = argList.filter(arg => !/^\-+/.test(arg))[0] || null;
		args.$task_args = argList.indexOf(args.$task);
		argList.forEach((arg, i) => {
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
	lastRun(func) { return { since: lastRun(func) }; },
	error(err) { return gutil.log(gutil.colors.red('[Error]'), err.toString()); },
	notify(title, message = 'Scripts Done') { return notify({ title: title, message: message }) },
	get errorHandler() {
		return plumber({
			errorHandler: notify.onError({
				title: 'Ошибка в плагине <%= error.plugin %>',
				message: "Ошибка: <%= error.message %>"
			})
		});
	}
};
