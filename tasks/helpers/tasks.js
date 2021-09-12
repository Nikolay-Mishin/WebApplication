const { tasksList, config: { tasksPath } } = require('./helpers');

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	const tasks = {};
	tasksList.forEach(task => tasks[task.replace(/\-+/g, '_')] = require(`${tasksPath}/${task}.js`));
	return process.node_tasks = tasks;
})();
