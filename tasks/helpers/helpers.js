const { lastRun, src } = require('gulp'), // отладка
	{ jsModule } = require('../../gulpfile.config'),
	fs = require('fs'),
	path = require('path'),
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
		const files = fs.readdirSync(_path);
		console.log('name: ', path.basename(files[0], '.js'));
		return files;
	}
};
