const { log } = require('console'),
	{ env: { INIT_CWD }, cwd: _cwd, argv: _argv } = require('process'),
	{ existsSync: exist, readFileSync: readFile, readdirSync: readDir, statSync: stat } = require('fs'),
	{ join, dirname, relative, basename: base, extname: ext, sep } = require('path'),
	cwd = _cwd(),
	argv = _argv.slice(2),
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
	values = obj => Object.values(obj),
	empty = obj => keys(obj).length == 0,
	fromEntries = entries => Object.fromEntries(entries),
	entries = obj => Object.entries(obj),
	filter = Object.filter = (obj, predicate) => fromEntries(entries(obj).filter(predicate)),
	isArray = obj => Array.isArray(obj),
	isObject = obj => (Object.isObject = Object.isObject || function (obj) {
		log('obj:', obj);
		log('constructor:', obj.constructor);
		log('this\n', this);
		return obj != null && obj.constructor === this;
	})(obj),
	fileName = file => base(file, ext(file)),
	isDir = path => exist(path) && stat(path).isDirectory(),
	isFile = path => exist(path) && stat(path).isFile(),
	getFolders = (path, { exclude = [] }) => readDir(path).filter(file => isDir(join(path, file)) && !exclude.includes(file)),
	getFiles = (path, { exclude = [], nonExt = false }) => readDir(path)
		.filter(file => isFile(join(path, file)) && !exclude.includes(nonExt ? fileName(file) : file))
		.map(file => nonExt ? file.replace(ext(file), '') : file),
	config = !isFile('config.json') ? {} : JSON.parse(readFile('config.json')),
	{ project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = isDir(_projectsPath),
			projectsPath = exist ? _projectsPath : cwd,
			projects = getFolders(projectsPath, { exclude })
				.concat(exist ? [] : getFolders(dirname(projectsPath), { exclude })),
			arg = filter(args, ([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : keys(arg)[1] || fileName(exist && INIT_CWD != cwd ? INIT_CWD : cwd),
			contextPath = join(projectsPath, project),
			context = exist && isDir(contextPath) ? contextPath : projectsPath;
		//log('INIT_CWD:', INIT_CWD);
		//log('cwd:', cwd);
		//log('projectsPath:', projectsPath);
		//log('exist:', exist);
		//log('fileName(cwd):', fileName(cwd));
		//log('name:', name);
		//log('project:', project);
		//log('context:', context);
		//log('args:', args);
		//log('arg:', arg);
		//log('projects:', projects);
		return { project, context };
	})(),
	runInContext = (path, cb) => {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	searchFile = (path, search, { json = false, parent = true, _cwd = true }) => {
		const searchPath = function (path) {
			const filePath = join(path, search),
				file = isDir(path) && isFile(filePath) ? readFile(filePath) : null;
			log('path:', path);
			return file ? file :
				parent ? this(dirname(path)) :
					_cwd ? this(cwd) : null;
		},
			file = searchPath(path);
		return !json ? file : JSON.parse(file);
	};

module.exports = {
	INIT_CWD, cwd, argv, parseArgs, args,
	keys, empty, fromEntries, entries, filter, isArray, isObject,
	fileName, isDir, isFile,
	getFolders, getFiles,
	config, project, context, runInContext, searchFile
};
