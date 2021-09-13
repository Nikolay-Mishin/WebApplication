import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { fileURLToPath as toPath } from 'url';
import { existsSync as exist, readFileSync as readFile, readdirSync as readDir, statSync as stat } from 'fs';
import { join, dirname, relative, basename as base, extname as ext, sep } from 'path';
//import config from '../../gulpfile.config.js';

const { INIT_CWD } = env,
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
	empty = obj => keys(obj).length == 0,
	filter = Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate)),
	_dirname = meta => dirname(toPath(meta.url)),
	_relative = (from, to) => relative(from.url ? _dirname(from) : from, to),
	//relativeRoot = from => _relative(from, root),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFolders = (path, { exclude = [] }) => readDir(path)
		.filter(file => isDir(join(path, file)) && !exclude.includes(file)),
	getFiles = (path, { exclude = [], nonExt = false }) => readDir(path)
		.filter(file => isFile(join(path, file)) && !exclude.includes(fileName(file)))
		.reduce((accumulator, file, i, files) => { files[i] = nonExt ? file.replace('.js', '') : file; return files; }, 0),
	config = !isFile('config.json') ? {} : JSON.parse(readFile('config.json')),
	{ name = '', deploy: { exclude = [] }, paths: { projects = '' } } = config,
	_projectsPath = join(cwd, projects),
	existProjects = isDir(_projectsPath),
	projectsPath = isDir(_projectsPath) ? _projectsPath : cwd,
	getContext = () => {
		const projects = getFolders(projectsPath, { exclude })
				.concat(existProjects ? [] : getFolders(dirname(projectsPath), { exclude })),
			arg = filter(args, ([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : keys(arg)[1] || fileName(INIT_CWD != cwd ? INIT_CWD : cwd);
		log('INIT_CWD:', INIT_CWD);
		log('cwd:', cwd);
		log('projectsPath:', projectsPath);
		log('existProjects:', existProjects);
		log('fileName(cwd):', fileName(cwd));
		log('name:', name);
		log('project:', project);
		log('args:', args);
		log('arg:', arg);
		//log('projects\n', projects);

		return project;
	},
	project = getContext(),
	runInContext = (path, cb) => {
		const context = relative(cwd, path),
			project = context.split(sep)[0];

		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);

		options.project = project; // Set project

		cb(); // Task call

		//gulp.watch('app-*/templates/*.jade').on('change', function (file) {
		//	runInContext(file, gulp.series('jade'));
		//});
	};

export default {
	project, config, INIT_CWD, cwd, argv, parseArgs, args, filter, _dirname, _relative, //relativeRoot,
	fileName, isDir, isFile, getFolders, getFiles,
	getContext, runInContext
};
