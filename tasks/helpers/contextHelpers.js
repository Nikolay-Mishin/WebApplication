import { log } from 'console';
import { env, cwd as $cwd, argv as $argv } from 'process';
import { readFileSync as readFile } from 'fs';
import { join, dirname, relative, sep } from 'path';

const { assignParentConfig, assignRootConfig } = {}.registerAll(
	function assignParentConfig(parent) { return parent.entries().map(file => file[1]).reverse(); },
	function assignRootConfig(root, config, parent) {
		return !config.isObject() ? config : root.assign(...parent.assignParentConfig(), config);
	}
);

export const { INIT_CWD } = env,
	cwd = $cwd(),
	argv = $argv.slice(2),
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
	args = (argList => parseArgs(argList))(argv);

const h = {}.registerAll(
	function runInContext(path, cb) {
		const context = relative(cwd, path),
			project = context.split(sep)[0];
		log(`[${project.replace('app-', '')}] has been changed:  + ${context}`);
		cb(); // Task call
		//watch('app-*/templates/*.jade').on('change', file => runInContext(file, series('jade')));
	},
	(function searchFile(path, search, parent = true) {
		const filePath = join(path, search),
			_file = path.isDir() && filePath.isFile() ? readFile(filePath) : null,
			result = () => {
				const result = {}.assign(this);
				[this.config, this.root, this.parent] = [null, null, {}];
				return result;
			};
		if (_file) {
			const file = _file.jsonParse() ?? _file,
				info = { path, file };
			this.config = this.config ?? info;
			this.parent = this.parent ?? {};
			if (this.config.path == cwd) return result();
			else if (file.root || path == cwd) {
				this.root = info;
				if (file.root) return result();
			}
			else if (parent && path != this.config.path && !this.parent[path]) {
				this.parent[path] = file;
			}
		}
		return !(parent && path != cwd && path != dirname(path)) ? result() :
			searchFile.call(this, dirname(path), ...arguments.from().slice(1));
	}).bind({}),
	function assignConfig(path, ...configList) {
		return configList.concat().map(file => {
			const { config, root = {}, parent = {} } = path.searchFile(file);
			return !config ? null : [
				file.fileName(),
				{ '@path': `${config.path}\\${file}` }.assign(root?.file ?? {}).assignRootConfig(config.file, parent)
			];
		}).fromEntries();
	},
	function setBinding(path, ...configList) {
		configList = path.assignConfig(...configList);
		const { config, package: $package, gulpfile } = configList;
		'configList\n'.log(configList);
		'gulpfile:'.log(gulpfile);
		return configList;
	}
);

const configList = INIT_CWD.setBinding('config.json', 'package.json', 'gulpfile.js');

//'configList\n'.log(configList);

export const { runInContext, searchFile, assignConfig } = h,
	{ config, package: $package } = configList,
	{ project, context } = (() => {
		const { name = '', deploy: { exclude = [] }, paths: { projects: projectsRoot = '' } } = config,
			_projectsPath = join(cwd, projectsRoot),
			exist = _projectsPath.isDir(),
			projectsPath = exist ? _projectsPath : cwd,
			projects = projectsPath.getFolders({ exclude })
				.concat(exist ? [] : dirname(projectsPath).getFolders({ exclude })),
			arg = args._filter(([arg, val]) => val === true && (projects.includes(arg))),
			project = !name ? name : arg.keys()[1] ?? (exist && INIT_CWD != cwd ? INIT_CWD : cwd).fileName(),
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

export default { INIT_CWD, cwd, argv, parseArgs, args, project, context }.assignDefine(h);
