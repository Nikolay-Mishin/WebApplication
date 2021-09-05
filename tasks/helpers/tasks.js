const { config, getFiles } = require('./helpers'),
	{
		tasksPath, excludeTasks = [],
		modules: {
			path: { basename, relative },
		}
	} = config;

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(`${relative(tasksPath, tasksPath) ? '.' : '..'}/${file}`);
	});
	return process.node_tasks = tasks;
})();
