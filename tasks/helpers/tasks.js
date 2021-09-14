import { pathToFileURL as toUrl } from 'url';
import h from './helpers.js';
const { tasksList, config: { tasksPath } } = h;

export default process.node_tasks = process.node_tasks || await (async function tasks() {
	const tasks = {};
	tasksList.forEach(task => tasks[task.replace(/\-+/g, '_')] = import(`${tasksPath ? toUrl(tasksPath) : '.'}/${task}.js`));
	for (let task in tasks) tasks[task] = (await tasks[task]).default;
	return process.node_tasks = tasks;
})();
