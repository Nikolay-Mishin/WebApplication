const { lastRun } = require('gulp'), // отладка
	config = require('../../gulpfile.config'),
	{ jsModule, tasksPath, excludeTasks = [], modules = {} } = config,
	fs = require('fs'),
	path = require('path'),
	{ join, basename, extname } = path,
	server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	lastRun(func) { return {since: lastRun(func)}; },
	error(err) { return gutil.log(gutil.colors.red('[Error]'), err.toString()); },
	notify(title, message = 'Scripts Done') { return notify({ title: title, message: message }) },
	errorHandler: {
		errorHandler: notify.onError({
			title: 'Ошибка в плагине <%= error.plugin %>',
			message: "Ошибка: <%= error.message %>"
		})
	},
	arg: (argList => {
		let arg = {}, a, opt, thisOpt, curOpt;
		for (a = 0; a < argList.length; a++) {
			thisOpt = argList[a].trim();
			opt = thisOpt.replace(/^\-+/, '');
			if (opt === thisOpt) {
				// argument value
				if (curOpt) arg[curOpt] = opt;
				curOpt = null;
			}
			else {
				// argument name
				curOpt = opt;
				arg[curOpt] = true;
			}
		}
		return arg;
	})(process.argv),
	get useWebpack() { return jsModule === 'es6'; },
	get domain() { return process.env.DEV_DOMAIN; },
	set domain(value) { process.env.DEV_DOMAIN = value; },
	get port() { return process.env.PORT; },
	set port(value) { process.env.PORT = value; },
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return this.getMode === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV || this.setMode(); },
	async setModeAsync(prod = false) { return this.setMode(prod); },
	setMode(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	get exports() { return process.NODE_EXPORTS; },
	set exports(value) { process.NODE_EXPORTS = value; },
	getFiles(_path, exclude = []) {
		return fs.readdirSync(_path).filter(file => extname(file) == '.js' && !exclude.includes(basename(file, '.js')));
	},
	_tasks: {},
	get tasks() {
		if (this._tasks.length > 0) return this._tasks;
		this.getFiles('tasks').forEach(file => {
			this._tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(join(tasksPath, file));
		});
		return this._tasks;
	},
	get modules() { return config.modules || {}; },
	addModule(name, module) {
		if (!config.modules) config.modules = {};
		return this.modules[name] = module;
	}
};
