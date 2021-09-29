import { log } from 'console';
import { env, cwd as _cwd, argv as _argv } from 'process';
import { readFileSync as readFile } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { assign, keys, isObject, fromEntries, entries } from './baseHelpers.js';

export const { INIT_CWD } = env,
	cwd = _cwd(),
	argv = _argv.slice(2),
	parseArgs = (argList, sep = '^\-+') => {
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
		return args;
	},
	args = (argList => parseArgs(argList))(argv),
	config = !'config.json'.isFile() ? {} : JSON.parse(readFile('config.json')),
	{ project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = isDir(_projectsPath),
			projectsPath = exist ? _projectsPath : cwd,
			projects = projectsPath.getFolders({ exclude })
				.concat(exist ? [] : dirname(projectsPath).getFolders({ exclude })),
			arg = args._filter(([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : keys(arg)[1] || (exist && INIT_CWD != cwd ? INIT_CWD : cwd).fileName(),
			contextPath = join(projectsPath, project),
			context = exist && contextPath.isDir() ? contextPath : projectsPath;
		//log('INIT_CWD:', INIT_CWD);
		//log('cwd:', cwd);
		//log('projectsPath:', projectsPath);
		//log('exist:', exist);
		//log('cwd.fileName():', cwd.fileName());
		//log('name:', name);
		//log('project:', project);
		//log('context:', context);
		//log('args:', args);
		//log('arg:', arg);
		//log('projects:', projects);
		return { project, context };
	})();

const h = ({}).registerAll(
	function runInContext(path, cb) {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	(function searchFile(path, search, { json = true, parent = true } = {}) {
		const args = assign([], arguments, { 2: { json, parent, _cwd } }),
			filePath = join(path, search),
			_file = path.isDir() && filePath.isFile() ? readFile(filePath) : null;
		if (_file) {
			const file = !json || isObject(_file) ? _file : JSON.parse(_file),
				info = { path, file };
			this.config = this.config || info;
			if (this.config.path == cwd) return this;
			else if (file.root || path == cwd) {
				this.root = info;
				if (file.root) return this;
			}
			else if (parent && path != this.config.path && !(this.parent = this.parent || {})[path]) {
				this.parent[path] = file;
			}
		}
		return !(parent && path != cwd && path != dirname(path)) ? this :
			searchFile.call(this, dirname(path), ...args.slice(1));
	}).bind({}),
	(function assignConfig(path, ...configList) {
		return fromEntries(configList.concat().map(file => {
			const { config, root, parent } = path.searchFile(file),
				parentList = entries(parent || {}).map(file => file[1]).reverse();
			return [file.fileName(), !root ? config.file : assign(root.file, ...parentList, config.file)];
		}));
	}).bind({})
);

export const { runInContext, searchFile, assignConfig } = h;

export default { INIT_CWD, cwd, argv, parseArgs, args, project, context }.assignDefine(h);
