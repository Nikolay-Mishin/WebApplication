const { src, dest, watch, lastRun } = require('gulp'),
	{ join } = require('path');

module.exports = async function tasksWatch() {
	watch('tasks/**/*', function tasks() {
		return src('tasks/**/*.js', { since: lastRun(tasks) })
			.on('data', file => console.log({ relative: join('tasks', file.relative), path: file.path }))
			.pipe(dest('../_server/tasks'))
			.pipe(dest('../../../tasks'));
	});
	watch('*.js', function jsWatch() {
		return src('*.js', { since: lastRun(jsWatch) })
			.on('data', file => console.log({ relative: file.relative, path: file.path }))
			.pipe(dest('../_server'))
			.pipe(dest('../../..'));
	});
	watch('../../../package.json', function packageWatch() {
		return src('../../../package.json', { since: lastRun(packageWatch) })
			.on('data', file => console.log({ relative: file.relative, path: file.path }))
			.pipe(dest('../_server'));
	});
};
