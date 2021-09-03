const { src } = require('gulp'),
	{ paths, deploy } = require('../gulpfile.config'),
	{ lastRun } = require('./helpers/helpers'),
	{ include, exclude } = deploy,
	rs = require('gulp-rsync');

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
