import { pathToFileURL as toUrl } from 'url';
import h from './helpers.js';
const { tasksList, config: { tasksPath } } = h;

export default process.node_tasks = process.node_tasks || await (async function tasks() {
	const tasks = {};
	tasksList.forEach(task => {
		const path = toUrl(tasksPath); // _relative(import.meta, tasksPath);
		tasks[task.replace(/\-+/g, '_')] = import(`${path ? path : '.'}/${task}.js`);
	});
	for (let key in tasks) tasks[key] = (await tasks[key]).default;
	return process.node_tasks = tasks;
})();
