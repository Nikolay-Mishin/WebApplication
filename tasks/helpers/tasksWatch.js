import gulp from 'gulp';
import { join } from 'path';

const { src, dest, watch, lastRun } = gulp;

export default async function tasksWatch() {
	watch('tasks/**/*', function tasks() {
		return src('tasks/**/*.js', { since: lastRun(tasks) })
			.on('data', file => console.log({ relative: join('tasks', file.relative), path: file.path }))
			//.pipe(dest('tasksWatch/tasks'));
			//.pipe(dest('../_server/tasksWatch/tasks'))
			//.pipe(dest('../../../tasksWatch/tasks'));
	});
	watch('*.js', function jsWatch() {
		return src('*.js', { since: lastRun(jsWatch) })
			.on('data', file => console.log({ relative: file.relative, path: file.path }))
			//.pipe(dest('tasksWatch'));
			//.pipe(dest('../_server/tasksWatch'));
			//.pipe(dest('../../../tasksWatch'));
	});
	watch(['../../../package.json', '../../../package.doc.json'], function packageWatch() {
		return src(['../../../package.json', '../../../package.doc.json'], { since: lastRun(packageWatch) })
			.on('data', file => console.log({ relative: file.relative, path: file.path }))
			//.pipe(dest('tasksWatch'));
			//.pipe(dest('../_server/tasksWatch'))
			//.pipe(dest('../../../tasksWatch'));
	});
};
