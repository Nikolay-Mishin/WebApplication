import gulp from 'gulp';
import { join, dirname } from 'path';

const { src, dest, watch, lastRun } = gulp,
	root = join(dirname(import.meta.url), '../..');

console.log('root: ', root);

export default async () => {
	const root = process.root;
	console.log('root: ', root);
	console.log('__dirname: ', process.__dirname(import.meta));
	watch([`${root}/*.js`, `${root}/*.json`, `${root}/tasks/**/*`], function gulpfile() {
		src([`${root}/../../../*.package.*json`, `${root}/gulpfile.js`, `${root}/*.config.js`], { since: lastRun(gulpfile) })
			.on('data', file => console.log(file.relative))
			//.pipe(dest(`${root}/../_server/gulpfile`))
			//.pipe(dest(`${root}/../../../gulpfile`));
		return src([`${root}/tasks/**/*`], { since: lastRun(gulpfile) })
			.on('data', file => console.log(`tasks/${file.relative}`))
			//.pipe(dest(`${root}/../_server/gulpfile/tasks`))
			//.pipe(dest(`${root}/../../../gulpfile/tasks`));
	})
};
