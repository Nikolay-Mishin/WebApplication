const { src } = require('gulp'),
	{ lastRun } = require('gulp'), // отладка
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
	}),
	getData: (path, callback = null, read = false) => {
		const data = {},
			func = (file, data) => { };
		callback = callback || func;

		src(path, { read: read }).on('data', file => {
			console.log({
				contents: file.contents, // содержимое файла
				path: file.paths, // путь до файла
				cwd: file.cwd, // основная директория
				base: file.base, // базовая директория
				// helpers
				relative: file.relative, // имя файла относительно текущей директории
				dirname: file.dirname, // имя текущей директории
				basename: file.basename, // название файла
				stem: file.stem, // имя файла
				extname: file.extname // расширение файла
			});
		}).pipe(file => callback(file, data));

		return data;
	}
};
