import { log } from 'console';
import h from './helpers.js';
const {
		config: { paths: { tasks: {
			root, deploy, watch: { tasks, root: $root, doc, package: $package, server }
		}}},
		modules: {
			gulp: { src, dest, watch, lastRun },
			path: { join },
			changed
		}
	} = h;

export default async () => {
	watch(tasks, function tasksWatch() {
		return src(tasks, { since: lastRun(tasksWatch) })
			.on('data', ({ extname, relative: rel, path }) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }))
			.pipe(dest(`${root}/tasks`))
			.pipe(dest(`${deploy}/tasks`));
	});
	watch($root, function rootWatch() {
		return src($root, { since: lastRun(rootWatch) })
			.on('data', ({ relative: rel, path }) => log({ rel, path }))
			.pipe(changed('./gulpfile.js', { hasChanged: changed.compareContents }))
			.pipe(dest(root))
			.pipe(dest(deploy));
	});
	watch(doc, function docWatch() {
		return src(doc, { since: lastRun(docWatch) })
			.on('data', ({ relative: rel, path }) => log({ rel, path }))
			.pipe(dest(`${deploy}/doc`));
	});
	watch(server.concat($package), function serverWatch() {
		return src(server, { since: lastRun(serverWatch) })
			.on('data', ({ relative: rel, path }) => log({ rel, path }))
			.pipe(dest(deploy));
	});

	src(['*lint*'])
		.on('data', ({ extname, relative: rel, path }) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }));
	src(['*.*lint*'])
		.on('data', ({ extname, relative: rel, path }) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }));
}
