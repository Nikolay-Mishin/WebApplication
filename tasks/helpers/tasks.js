const { importModules, config: { tasksPath, excludeTasks } } = require('./helpers');

module.exports = process.node_tasks = process.node_tasks || (() => importModules(tasksPath, excludeTasks))();
