const { log } = console,
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

module.exports = {
	relativeRoot,
	get config() { return process.node_config; },
	set config(value) { process.node_config[name = Object.keys(value)[0]] = value[name]; },
	get modules() { return this.config.modules; },
	get tasks() { return process.node_tasks; },
	get webpackConfig() {
		return exist(wc = webpackConfig) && this.getMode ? (this.config = { webpackConfig: require(wc) }).webpackConfig : null;
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
	get dev() { return (this.getMode || this.setModeSync()) === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV; },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	fileName,
	getFiles(_path, exclude = []) {
		return readDir(_path).filter(file => ext(file) !== '' && !exclude.includes(fileName(file)));
	},
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
	})(process.argv),
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
