const gulp = require('gulp')

const server = require('./gulp/tasks/server')
const pug2html = require('./gulp/tasks/pug2html')
const styles = require('./gulp/tasks/styles')
const scripts = require('./gulp/tasks/scripts')
const fonts = require('./gulp/tasks/fonts')
const imageMinify = require('./gulp/tasks/imageMinify')
const clean = require('./gulp/tasks/clean')
const copyDependencies = require('./gulp/tasks/copyDependencies')
const lighthouse = require('./gulp/tasks/lighthouse')
const svgSprite = require('./gulp/tasks/svgSprite')

function setMode(isProd = false) {
  return cb => {
    process.env.NODE_ENV = isProd ? 'production' : 'development'
    cb()
  }
}

const dev = gulp.parallel(pug2html, styles, scripts, fonts, imageMinify, svgSprite)

const build = gulp.series(clean, copyDependencies, dev)

module.exports.start = gulp.series(setMode(), build, server)
module.exports.build = gulp.series(setMode(true), build)

module.exports.lighthouse = gulp.series(lighthouse)
