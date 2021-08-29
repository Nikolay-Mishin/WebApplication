const { src } = require('gulp'),
	{ paths, site } = require('../gulpfile.config');

module.exports = function sftp_push() {
	return src(paths.build.all)
		.pipe(sftp({
			host: site.host,
			user: site.user,
			pass: site.pass,
			port: site.port,
			remotePath: site.folder
		}));
};