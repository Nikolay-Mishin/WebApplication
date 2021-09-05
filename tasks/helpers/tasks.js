import { config, getFiles } from 'helpers.js';
import config from '../../gulpfile.config.js';
const {
	tasksPath, excludeTasks = [],
	modules: {
		path: { basename },
	}
} = config;

export default process.node_tasks = process.node_tasks || (function tasks() {
	if (process.node_tasks) return process.node_tasks;
	process.node_tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(file => {
		process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = import(`${relativeRoot(tasksPath)}/${file}`);
	});
	return process.node_tasks;
})();
