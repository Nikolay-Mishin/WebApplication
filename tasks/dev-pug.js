const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	{ lastRun } = require('./helpers/helpers'),
	pug = require('gulp-pug'); // плагин перезагрузки браузера
	
module.exports = function dev_pug() {
	return src(paths.src.pug, lastRun(dev_pug))
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.build.root));
};
