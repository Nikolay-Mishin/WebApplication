import gulp from 'gulp';
import { join, dirname } from 'path';

const { src, dest, watch, lastRun } = gulp;

export default async function tasksWatch() {
	const root = process.root;
	console.log('root:', root);
	console.log('__dirname:', process.__dirname(import.meta));
	const server = join(root, '../../..'),
		_package = join(server, 'package.json'),
		_package_doc = join(server, 'package.doc.json');
	console.log('watch:', _package);
	//watch(`${root}/*.js`, function jsWatch() {
	//	console.log('jsWatch');
	//	return src(`${root}/*.js`/*, { since: lastRun(jsWatch) }*/)
	//		.on('data', file => console.log(file.relative))
	//		.pipe(dest(`${root}/../_server/tasksWatch`));
	//		//.pipe(dest(`${root}/../../../tasksWatch`));
	//});
	//watch(`${root}/tasks/**/*`, function tasks() {
	//	console.log('tasksWatch');
	//	return src([`${root}/tasks/**/*`]/*, { since: lastRun(tasks) }*/)
	//		.on('data', file => console.log(`tasks/${file.relative}`))
	//		.pipe(dest(`${root}/../_server/tasksWatch/tasks`));
	//		//.pipe(dest(`${root}/../../../tasksWatch/tasks`));
	//});
	//watch(_package, function packageWatch() {
	//	console.log('jsWatch');
	//	return src(_package, { since: lastRun(packageWatch) })
	//		.on('data', file => console.log(file.relative))
	//		.pipe(dest(`${root}/../_server/tasksWatch`));
	//		//.pipe(dest(`${root}/../../../tasksWatch`));
	//});
	
	watch(`${root}/*.js`, function jsWatch1() {
		console.log('jsWatch1');
	});
	watch(join(root, '*.js'), function jsWatch2() {
		console.log('jsWatch2');
	});
	watch(`${root}/gulpfile.js`, function jsWatch3() {
		console.log('jsWatch3');
	});
	console.log('js:', `${root}/*.js`);
	console.log('join:', join(root, '*.js'));

	return src(`${root}/*.js`, { since: lastRun(tasksWatch) })
		.on('data', file => console.log(file.relative))
		.pipe(dest(`${root}/../_server/tasksWatch`));
		//.pipe(dest(`${root}/../../../tasksWatch`));
};
