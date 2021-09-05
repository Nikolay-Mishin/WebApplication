import h from './helpers.js';
const { config, getFiles, __dirname } = h,
	{
		tasksPath, excludeTasks = [],
		modules: {
			path: { basename: base, relative },
		}
	} = config;

export default process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		const path = relative(__dirname(import.meta), tasksPath);
		tasks[base(file, '.js').replace(/\-+/g, '_')] = (await import(`${path ? path : '.'}/${file}`)).default;
	});
	return process.node_tasks = tasks;
})();
