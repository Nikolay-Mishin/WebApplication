const config = require('../../gulpfile.config'),
	{
		esModuleDefault, esModule = esModuleDefault, root, helpers: _helpers = {}, useWebpack,
		modules: {
			gulp: { lastRun },
			fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir },
			path: { join, basename: base, extname: ext },
			gutil, notify, plumber
		},
		webpackConfig = join(root, 'webpack.config.js'),
		tsconfig = join(root, 'tsconfig.json')
	} = config;

const helpers = {
	get config() { return process.node_config; },
	get modules() { return this.config.modules; },
	get tasks() { return process.node_tasks; },
	get useWebpack() {
		//if (useWebpack) return useWebpack;
		if (exist(webpackConfig)) process.node_config.webpackConfig = webpackConfig;
		const module = esModule || !exist(tsconfig) ? 'es6' : JSON.parse(readFile(tsconfig)).compilerOptions.module;
		console.log('useWebpack.NODE_ENV:', process.env.NODE_ENV);
		console.log('useWebpack.mode:', this.config.webpackConfig.mode);
		return process.node_config.useWebpack = esModule === 'es6';
	},
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return this.getMode === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV || this.setModeSync(); },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	getFiles(_path, exclude = []) {
		return readDir(_path).filter(file => ext(file) == '.js' && !exclude.includes(base(file, '.js')));
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

Object.assign(helpers, _helpers);

module.exports = helpers;
