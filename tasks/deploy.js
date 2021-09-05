const {
	lastRun,
	config: { paths, deploy: { include, exclude } },
	modules: {
		gulp: { src },
		rs
	}
} = require('./helpers/helpers');

module.exports = function deploy() {
	return src(paths.build.root, lastRun(deploy))
		.pipe(rs({
			root: paths.build.root,
			hostname: deploy.host,
			destination: deploy.folder,
			port: deploy.port,
			include: include,
			exclude: exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
};
