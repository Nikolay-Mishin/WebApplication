import h from './helpers.js';
const { importModules, config: { tasksPath, excludeTasks = [] } } = h;

export default process.node_tasks = process.node_tasks || await (async () => await importModules(tasksPath, excludeTasks))();
