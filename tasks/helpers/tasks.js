const { config, getFiles } = require('./helpers'),
	{
		tasksPath, excludeTasks = [],
		modules: {
			path: { basename: base, relative },
		}
	} = config;

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		tasks[base(file, '.js').replace(/\-+/g, '_')] = require(`${p = relative(__dirname, tasksPath) ? p : '.'}/${file}`);
	});
	return process.node_tasks = tasks;
})();
