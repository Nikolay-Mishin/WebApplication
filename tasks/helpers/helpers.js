const { lastRun, src } = require('gulp'), // отладка
	{ jsModule } = require('../../gulpfile.config'),
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
	get files() {
		return process.NODE_FILES;
	},
	setFiles: (path, exports = {}, read = false) => {
		process.NODE_FILES = {};
		return src(`${path}/*`, { read: read }).on('data', file => {
			console.log(file);
			if (file.stem !== file.basename && file.extname !== '') {
				process.NODE_FILES[file.stem] = {
					file: file,
					contents: file.contents, // содержимое файла
					path: file.path, // путь до файла
					name: file.stem, // имя файла
					basename: file.basename, // название файла
					ext: file.extname, // расширение файла
					dir: file.dirname, // имя текущей директории
					parent_dir: file.cwd, // основная директория
				};
				//console.log(process.NODE_FILES);
			}
		});
	}
};
