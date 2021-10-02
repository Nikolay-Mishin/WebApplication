import { log } from 'console';
import h from './helpers.js';
const {
		config: { paths: { tasks: {
			root, deploy, watch: { tasks, root: _root, doc, package: _package, server }
		}}},
		modules: {
			gulp: { src, dest, watch, lastRun },
			path: { join },
			changed
		}
	} = h;

export default async () => {
	watch(tasks, function _tasksWatch() {
		return src(tasks, { since: lastRun(_tasksWatch) })
			.on('data', ({ extname, relative: rel, path }) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }))
			.pipe(dest(`${root}/tasks`))
			.pipe(dest(`${deploy}/tasks`));
	});
	watch(_root, function rootWatch() {
		return src(_root, { since: lastRun(rootWatch) })
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
	watch(server.concat(_package), function serverWatch() {
		return src(server, { since: lastRun(serverWatch) })
			.on('data', ({ relative: rel, path }) => log({ rel, path }))
			.pipe(dest(deploy));
	});
}
