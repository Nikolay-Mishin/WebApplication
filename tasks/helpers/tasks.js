const {
		config: { tasksPath },
		modules: { path: { basename: base, relative } },
		tasksList
	} = require('./helpers');

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	tasksList.forEach(file => tasks[base(file, '.js').replace(/\-+/g, '_')] = require(`${tasksPath}/${file}`));
	return process.node_tasks = tasks;
})();
