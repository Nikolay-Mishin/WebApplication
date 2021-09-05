import config from '../../gulpfile.config.js';
import h from 'helpers.js'; // 'server'
const
	{
		excludeTasks = [],
		modules: {
			path: { basename },
		}
	} = config,
	{ getFiles } = h;

export default process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	process.node_tasks = {};
	getFiles('tasks', excludeTasks).forEach(file => {
		process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = import(`../${file}`);
	});
	return process.node_tasks;
})();
