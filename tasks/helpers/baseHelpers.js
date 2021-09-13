const { log } = require('console'),
	{ env: { INIT_CWD } , cwd: _cwd, argv: _argv } = require('process'),
	{ existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat } = require('fs'),
	{ join, dirname, relative, basename: base, extname: ext, sep } = require('path'),
	//config = require('../../gulpfile.config'),
	cwd = _cwd(),
	argv = _argv.slice(2),
	//{
	//	root, useWebpack, esModule, tasksPath, excludeTasks = [], helpers: _helpers,
	//	modules: {
	//		gulp: { lastRun },
	//		fs: { existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat },
	//		path: { join, dirname, relative, basename: base, extname: ext, sep },
	//		gutil, notify, plumber
	//	},
	//	//webpackConfig = join(root, 'webpack.config.js'),
	//	//tsconfig = join(root, 'tsconfig.json')
	//} = config,
	parseArgs = (argList, assign = {}, sep = '^\-+') => {
		let args = {}, opt, thisOpt, curOpt;
		argList.forEach(arg => {
			thisOpt = arg.trim();
			opt = thisOpt.replace(new RegExp(sep), '');
			if (thisOpt === opt) {
				if (curOpt) args[curOpt] = opt; // argument value
				curOpt = null;
			}
			else args[curOpt = opt] = true; // argument name
		});
		return Object.assign(assign, args);
	},
	args = (argList => parseArgs(argList))(argv),
	keys = obj => Object.keys(obj),
	filter = Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate)),
	//relativeRoot = from => _relative(from, root),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFolders = (path, { exclude = [] }) => readDir(path)
		.filter(file => isDir(join(path, file)) && !exclude.includes(file)),
	getFiles = (path, { exclude = [], nonExt = false }) => {
		return readDir(path).filter(file => isFile(join(path, file)) && !exclude.includes(fileName(file)))
			.reduce((accumulator, file, i, files) => { files[i] = nonExt ? file.replace('.js', '') : file; return files; }, 0);
	},
	config = !isFile('config.json') ? {} : JSON.parse(readFile('config.json')),
	{ name, deploy: { exclude }, paths: { projects = '' } } = config,
	_projectsPath = join(cwd, projects),
	projectsPath = isDir(_projectsPath) ? _projectsPath : cwd;

function getContext(_name) {
	//let _argv = argv[0] || argv[1];
	//if (typeof _argv !== 'undefined' && _argv.indexOf('--') < 0) _argv = argv[1];
	//return (typeof _argv === 'undefined') ? _name : _argv.replace('--', '');
	const project = fileName(cwd),
		projects = getFolders(projectsPath, { exclude }),
		parent = getFolders(dirname(projectsPath), { exclude }),
		argv = filter(args, ([arg, val]) => val === true && (projects.includes(arg) || parent.includes(arg))),
		projectName = INIT_CWD != cwd && argv.length > 0 ? fileName(INIT_CWD) : name;
	log('INIT_CWD:', INIT_CWD);
	log('cwd:', cwd);
	log('projectsPath:', projectsPath);
	log('project:', project);
	log('name:', name);
	log('projectName:', projectName);
	log('args:', args);
	log('argv:', argv);
	log('INIT_CWD != cwd:', INIT_CWD != cwd);
	log('argv.length > 0:', argv.length > 0);
	//log('projects\n', projects);
	//log('parent:', parent);
}

const options = {
	project: 'app-' + getContext('canonium')
};

function runInContext(path, cb) {
	const context = relative(cwd(), path),
		project = context.split(sep)[0];

	//console.log(
	//	'[' + chalk.green(project.replace('app-', '')) + ']' +
	//	' has been changed: ' + chalk.cyan(context)
	//);
	log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);

	options.project = project; // Set project

	cb(); // Task call

	// Example
	//gulp.watch('app-*/templates/*.jade').on('change', function (file) {
	//	runInContext(file, gulp.series('jade'));
	//});
}

module.exports = {
	config, INIT_CWD, cwd, argv, parseArgs, args, filter, /*relativeRoot, */fileName, isDir, isFile, getFolders, getFiles,
	getContext, runInContext, options
};

