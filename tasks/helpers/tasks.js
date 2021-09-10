import { pathToFileURL as toUrl } from 'url';
import h from './helpers.js';
const { config, getFiles } = h,
	{
		tasksPath, excludeTasks = [],
		modules: { path: { basename: base } },
	} = config;

export default process.node_tasks = process.node_tasks || await (async function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		const path = toUrl(tasksPath); // _relative(import.meta, tasksPath);
		tasks[base(file, '.js').replace(/\-+/g, '_')] = import(`${path ? path : '.'}/${file}`);
	});
	for (let key in tasks) tasks[key] = (await tasks[key]).default;
	return process.node_tasks = tasks;
})();
