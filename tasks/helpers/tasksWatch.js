import gulp from 'gulp';
const { src, dest, watch, lastRun } = gulp;

export default async () => {
	const root = process.root;
	console.log('root: ', root);
	console.log('__dirname: ', process.__dirname(import.meta));
	watch([`${root}/*.js`, `${root}/*.json`, `${root}/tasks/**/*`], function gulpfile() {
		src([`${root}/gulpfile.js`, `${root}/*.config.js`], { since: lastRun(gulpfile) }).on('data', file => {
			console.log(file.relative);
		})
		//.pipe(dest(`${root}/../_server/gulpfile`))
		//.pipe(dest(`${root}/../../../gulpfile`));
		return src([`${root}/tasks/**/*`], { since: lastRun(gulpfile) }).on('data', file => {
			console.log(`tasks/${file.relative}`);
		})
		//.pipe(dest(`${root}/../_server/gulpfile/tasks`))
		//.pipe(dest(`${root}/../../../gulpfile/tasks`));
	})
};
