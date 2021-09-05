import config from '../../gulpfile.config.js'; // 'server'
const {
	helpers = {},
	modules: {
		gulp: { lastRun },
		fs: { readdirSync },
		path: { basename, extname },
		gutil, notify, plumber
	}
} = config;

Object.assign(helpers, {
	get config() { return config; },
	get modules() { return this.config.modules; },
	get useWebpack() { return this.config.esModule === 'es6'; },
	get mode() { return this.dev ? 'dev' : 'prod'; },
	get dev() { return this.getMode === 'development'; },
	get prod() { return !this.dev; },
	get getMode() { return process.env.NODE_ENV || this.setModeSync(); },
	setMode(prod = false) { return async () => this.setModeSync(prod); },
	setModeSync(prod = false) { return process.env.NODE_ENV = prod ? 'production' : 'development'; },
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
	getFiles(_path, exclude = []) {
		return readdirSync(_path).filter(file => extname(file) == '.js' && !exclude.includes(basename(file, '.js')));
	},
	lastRun(func) { return { since: lastRun(func) }; },
	error(err) { return gutil.log(gutil.colors.red('[Error]'), err.toString()); },
	notify(title, message = 'Scripts Done') { return notify({ title: title, message: message }) },
	get errorHandler() {
		return plumber({
			errorHandler: notify.onError({
				title: 'Ошибка в плагине <%= error.plugin %>',
				message: "Ошибка: <%= error.message %>"
			})
		});
	}
});

export default helpers;
