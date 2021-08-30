const { lastRun } = require('gulp'), // отладка
	//server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	get mode() {
		return process.env.NODE_ENV;
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
	lastRun: func => { since: lastRun(func) },
	//server: server,
	//reload: done => {
	//	server.reload();
	//	done();
	//},
	error: err => gutil.log(gutil.colors.red('[Error]'), err.toString()),
	notify: (title, message = 'Scripts Done') => notify({
		title: title,
		message: message
	})
};
