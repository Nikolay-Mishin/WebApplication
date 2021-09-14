const { log } = console,
	{ tasksList, config: { tasksPath }, imports } = require('./helpers');

module.exports = process.node_tasks = process.node_tasks || (function tasks() {
	const tasks = {};
	tasksList.forEach(task => tasks[task.replace(/\-+/g, '_')] = require(`${tasksPath ? tasksPath : '.'}/${task}.js`));
	log('imports\n', imports);
	return process.node_tasks = tasks;
})();
