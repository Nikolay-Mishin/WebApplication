const { lastRun } = require('gulp'), // отладка
	config = require('../../gulpfile.config'),
	{ excludeTasks = [], modules = {} } = config,
	fs = require('fs'),
	path = require('path'),
	{ join, basename, extname } = path,
	server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	get config() { return process.env.node_config; },
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
	get domain() { return process.env.dev_domain; },
	set domain(value) { process.env.dev_domain = value; },
	get port() { return process.env.port; },
	set port(value) { process.env.port = value; },
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return this.getMode === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV || this.setModeSync(); },
	async setMode(prod = false) { return this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
	get exports() { return process.node_exports; },
	set exports(value) { process.node_exports = value; },
	getFiles(_path, exclude = []) {
		return fs.readdirSync(_path).filter(file => extname(file) == '.js' && !exclude.includes(basename(file, '.js')));
	},
	_tasks: {},
	get tasks() {
		if (this._tasks.length > 0) return this._tasks;
		this.getFiles(__dirname, excludeTasks).forEach(file => {
			this._tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(join(__dirname, file));
		});
		return this._tasks;
	},
	get modules() { return this.config.modules || {}; },
	addModule(name, module) {
		if (this.modules.length > 0) this.config.modules = {};
		return this.modules[name] = module;
	}
};
