const { join } = require('path'),
	gulp = require('gulp'),
	npmDist = require('gulp-npm-dist'),
	del = require('del');

const config = require('./config');

module.exports = function copyModules(done) {
	del(config.copyDependencies.dist).then(() => {
		gulp.src(npmDist(), { base: join(config.root, 'node_modules') })
			.pipe(gulp.dest(config.copyDependencies.dist)).on('end', done)
	}).catch(done);
}
