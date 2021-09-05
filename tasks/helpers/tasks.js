const { config, getFiles } = require('helpers'),
	{
		excludeTasks = [],
		modules: {
			path: { basename },
		}
	} = config;

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	process.node_tasks = {};
	getFiles('tasks', excludeTasks).forEach(file => {
		process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(`../${file}`);
	});
	return process.node_tasks;
})();
