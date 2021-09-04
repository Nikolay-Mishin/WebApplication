const config = require('../../gulpfile.config.js'),
	{
		excludeTasks = [],
		modules: {
			fs: { readdirSync },
			path: { join, basename, extname, dirname }
		}
	} = config;

modules.exports = (() => {
	console.log(process.node_tasks);
	if (process.node_tasks) return process.node_tasks;
	console.log(process.node_tasks);
	process.node_tasks = {};
	this.getFiles('tasks'), excludeTasks).forEach(file => {
		process.node_tasks[basename(file, '.js').replace(/\-+/g, '_')] = require(join(dirname(__dirname), file));
	});
	return process.node_tasks;
})()
