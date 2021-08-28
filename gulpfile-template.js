const { series, parallel } = require('gulp'),
	{ setMode } = require('./tasks/_helpers');

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

const build = series(clean, copyDependencies, parallel(pug2html, styles, scripts, fonts, imageMinify, svgSprite));

exports.start = series(setMode(), build, server);
exports.build = series(setMode(true), build);
exports.lighthouse = series(lighthouse);
