const { lastRun } = require('gulp'), // отладка
	config = require('../../gulpfile.config'),
	{ jsModule, tasksPath, excludeTasks = [], modules = {} } = config,
	fs = require('fs'),
	path = require('path'),
	{ join, basename, extname } = path,
	//server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	lastRun(func) { return { since: lastRun(func) }; },
	error(err) { return gutil.log(gutil.colors.red('[Error]'), err.toString()); },
	notify(title, message = 'Scripts Done') { return notify({
		title: title,
		message: message
	})},
	get useWebpack() { return jsModule === 'es6'; },
	get mode() { return process.env.NODE_ENV || 'dev'; },
	get dev() { return this.mode ? this.mode === 'development' : true; },
	get prod() { return !this.dev; },
	async setMode(prod = false) {
		return process.env.NODE_ENV = prod ? 'production' : 'development';
		//return done => {
		//	process.env.NODE_ENV = prod ? 'production' : 'development';
		//	done();
		//}
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
	get exports() {
		return process.NODE_EXPORTS;
	},
	set exports(value) {
		process.NODE_EXPORTS = value;
	},
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
	addModule(name, module) {
		return this.modules[name] = module;
	},
	get modules() {
		return config.modules || {};
	},
	set modules(value) {
		if (!config.modules) config.modules = {};
		return config.modules;
	}
};
