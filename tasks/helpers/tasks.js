import config from './config.js';

const { tasksPath, excludeTasks } = config;

export default process.node_tasks = process.node_tasks ?? await tasksPath.importModules(excludeTasks);;
