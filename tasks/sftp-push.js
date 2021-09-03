const { src } = require('gulp'),
	{ paths, deploy } = require('../gulpfile.config'),
	{ lastRun } = require('./helpers/helpers');

module.exports = function sftp_push() {
	return src(paths.build.root, lastRun(sftp_push))
		.pipe(sftp({
			host: deploy.host,
			user: deploy.user,
			pass: deploy.pass,
			port: deploy.port,
			remotePath: deploy.folder
		}));
};
