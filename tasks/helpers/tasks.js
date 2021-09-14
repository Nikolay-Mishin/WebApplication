import h from './helpers.js';
const { config: { tasksPath, excludeTasks = [] }, imports } = h;

export default process.node_tasks = process.node_tasks || await (async () => await imports(tasksPath, excludeTasks))();
