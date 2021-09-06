import h from './helpers.js';
const { log } = console,
	{
		config: { paths: { tasks: {
			root, deploy, watch: { tasks, doc, package, editor, root: _root }
		} } },
		modules: {
			gulp: { src, dest, watch, lastRun },
			path: { join }
		}
	} = h;

export default async function tasksWatch() {
	watch(tasks, function _tasksWatch() {
		return src(tasks, { since: lastRun(_tasksWatch) })
			.on('data', ({ extname, relative: rel, path } = f) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }))
			.pipe(dest(`${root}/tasks`))
			.pipe(dest(`${deploy}/tasks`));
	});
	watch(_root, function rootWatch() {
		return src(_root, { since: lastRun(rootWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(root))
			.pipe(dest(deploy));
	});
	watch(doc, function docWatch() {
		return src(doc, { since: lastRun(docWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(`${deploy}/doc`));
	});
	watch(server, function serverWatch() {
		return src(server, { since: lastRun(serverWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(deploy));
	});
};
