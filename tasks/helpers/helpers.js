const config = require('../../gulpfile.config'), // 'server'
	{
		excludeTasks = [], helpers = {},
		modules: {
			gulp: { lastRun },
			fs: { readdirSync },
			path: { join, basename, extname, dirname },
			gutil, notify, plumber
		}
	} = config;

Object.assign(helpers, {
	get config() { return config; },
	lastRun(func) { return {since: lastRun(func)}; },
	error(err) { return gutil.log(gutil.colors.red('[Error]'), err.toString()); },
	notify(title, message = 'Scripts Done') { return notify({ title: title, message: message }) },
	get errorHandler() {
		return plumber({
			errorHandler: notify.onError({
				title: 'Ошибка в плагине <%= error.plugin %>',
				message: "Ошибка: <%= error.message %>"
			})
		});
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
	get useWebpack() { return this.config.esModule === 'es6'; },
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return this.getMode === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV || this.setModeSync(); },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	getFiles(_path, exclude = []) {
		return readdirSync(_path).filter(file => extname(file) == '.js' && !exclude.includes(basename(file, '.js')));
	},
	get tasks() {
		console.log(process.node_tasks);
		if (process.node_tasks) return process.node_tasks;
		console.log(process.node_tasks);
		process.node_tasks = {};
		this.getFiles('tasks', excludeTasks).forEach(file => {
			console.log(file);
			process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(`../${file}`);
		});
		return process.node_tasks;
	},
	get modules() { return this.config.modules; }
});

module.exports = helpers;
