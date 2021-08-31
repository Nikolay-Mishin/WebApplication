const { lastRun } = require('gulp'), // отладка
	{ jsModule, tasksPath } = require('../../gulpfile.config'),
	fs = require('fs'),
	path = require('path'),
	{ join } = path,
	//server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	lastRun: func => { since: lastRun(func) },
	error: err => gutil.log(gutil.colors.red('[Error]'), err.toString()),
	notify: (title, message = 'Scripts Done') => notify({
		title: title,
		message: message
	}),
	//server: server,
	//reload: done => {
	//	server.reload();
	//	done();
	//},
	get useWebpack() {
		return jsModule === 'es6';
	},
	get mode() {
		return process.env.NODE_ENV || 'dev';
	},
	get dev() {
		return this.mode ? this.mode === 'development' : true;
	},
	get prod() {
		return !this.dev;
	},
	setMode: (prod = false) => {
		return process.env.NODE_ENV = prod ? 'production' : 'development';
		return done => {
			process.env.NODE_ENV = prod ? 'production' : 'development';
			done();
		}
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
	get files() {
		return process.NODE_FILES;
	},
	getFiles: _path => {
		return fs.readdirSync(_path).filter(file => path.extname(file) == '.js');
	},
	_tasks: {},
	get tasks() {
		if (this._tasks.length > 0) return this._tasks;
		this.getFiles('tasks').forEach(file => {
			this._tasks[path.basename(file, '.js').replace(/\-+/g, '_')] = require(join(tasksPath, file));
		})
		return this._tasks;
	}
};
