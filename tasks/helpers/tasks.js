import h from 'helpers.js';
const { config, getFiles, __dirname } = h,
	{
		tasksPath, excludeTasks = [],
		modules: {
			path: { basename, relative },
		}
	} = config;

export default process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	process.node_tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = import(`${relative(tasksPath, __dirname)}/${file}`);
	});
	return process.node_tasks;
})();
