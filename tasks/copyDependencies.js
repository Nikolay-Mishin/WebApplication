const config = require('../gulpfile-template.config'),
	path = require('path'),
	gulp = require('gulp'),
	npmDist = require('gulp-npm-dist'),
	del = require('del');

module.exports = function copyModules(cb) {
	del(config.copyDependencies.dist).then(() => {
		gulp.src(npmDist(), { base: path.resolve(config.root, 'node_modules') })
			.pipe(gulp.dest(config.copyDependencies.dist)).on('end', cb);
	}).catch(cb);
};
