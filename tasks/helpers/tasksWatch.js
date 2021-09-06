const {
	config: { paths: { tasks: {
		root, deploy, watch: { tasks, doc, package, root: _root }
	}}},
	modules: {
		gulp: { src, dest, watch, lastRun },
		path: { join }
	}
} = require('./helpers'),
	{ log } = console;

module.exports = async function tasksWatch() {
	watch(tasks, function _tasksWatch() {
		return src(tasks, { since: lastRun(_tasksWatch) })
			.on('data', ({ extname, relative: rel, path } = f) => extname !== '.js' ? '' : log({ rel: join('tasks', rel), path }))
			.pipe(dest(`${root}/tasks`))
			.pipe(dest(`${deploy}/tasks`));
	});
	watch(_root, function jsWatch() {
		return src(_root, { since: lastRun(jsWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(root))
			.pipe(dest(deploy));
	});
	watch(doc, function docWatch() {
		return src(doc, { since: lastRun(docWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(`${deploy}/doc`));
	});
	watch(package, function packageWatch() {
		return src(package, { since: lastRun(packageWatch) })
			.on('data', ({ relative: rel, path } = file) => log({ rel, path }))
			.pipe(dest(deploy));
	});
};
