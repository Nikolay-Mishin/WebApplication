const path = require('path')
const gulp = require('gulp')
const npmDist = require('gulp-npm-dist')
const del = require('del')

const config = require('../gulpfile-template.config')

module.exports = function copyModules(cb) {
	del(config.copyDependencies.dist).then(() => {
		gulp.src(npmDist(), { base: path.join(config.build, 'node_modules') })
			.pipe(gulp.dest(config.copyDependencies.dist)).on('end', cb)
	}).catch(cb)
}
