const { log } = require('console'),
	{ argv: _argv } = process,
	imports = require('./import'),
	h = require('./baseHelpers'),
	{ argv, _relative, isDir, isFile, setBind } = h,
	config = require('../../gulpfile.config'),
	{
		root, useWebpack, esModule,
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
	setMode (prod = false) { /*log('this\n', this);*/ return async () => { /*log('this-async\n', this);*/ return this.setModeSync(prod); }; },
	setModeSync: (prod = false) => process.env.NODE_ENV = prod ? 'production' : 'development',
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

log('helpers.setMode', helpers.setMode);
log('bind(helpers.setMode)', setBind(helpers, helpers.setMode));
log('helpers.setMode', helpers.setMode);
helpers.setMode = helpers.setMode.bind(helpers);
log('helpers.setMode.bind', helpers.setMode);

Object.assign(helpers, h, imports);

module.exports = helpers;
