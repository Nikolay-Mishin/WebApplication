const { lastRun } = require('gulp'), // отладка
	{ jsModule } = require('../../gulpfile.config'),
	//server = require('browser-sync').create(),
	gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	get useWebpack() {
		return jsModule === 'es6';
	},
	get mode() {
		return process.env.NODE_ENV || 'dev';
	},
	get dev() {
		return this.mode ? this.mode === 'dev' : true;
	},
	get prod() {
		return !this.dev;
	},
	setMode: (prod = false) => {
		return process.env.NODE_ENV = prod ? 'prod' : 'dev';
		return done => {
			process.env.NODE_ENV = prod ? 'prod' : 'dev';
			done();
		}
	},
	error: function(err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	},
	notify: function(title, message = 'Scripts Done') {
		return notify({
			title: title,
			message: message
		});
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
