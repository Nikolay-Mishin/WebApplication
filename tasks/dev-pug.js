const { src, dest } = require('gulp'),
	{ paths } = require('../gulpfile.config'),
	pug = require('gulp-pug'); // плагин перезагрузки браузера
	
module.exports = function dev_pug() {
	return src(paths.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.build.all));
};
