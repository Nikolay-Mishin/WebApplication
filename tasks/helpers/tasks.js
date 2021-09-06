import h from './helpers.js';
const { config, __dirname, getFiles } = h,
	{
		tasksPath, excludeTasks = [],
		modules: { path: { basename: base, relative } },
	} = config;

export default process.node_tasks = process.node_tasks || (async function tasks() {
	if (process.node_tasks) return process.node_tasks;
	const tasks = {};
	getFiles(tasksPath, excludeTasks).forEach(async file => {
		const path = relative(__dirname(import.meta), tasksPath);
		console.log(file);
		tasks[base(file, '.js').replace(/\-+/g, '_')] = (await import(`${path ? path : '.'}/${file}`)).default;
	});
	return process.node_tasks = tasks;
})();
