/// <binding ProjectOpened='_test' />
// <binding AfterBuild='build' ProjectOpened='watch:webpack' />

const { task, series, parallel } = require('gulp'), // сам gulp
	env = process.env.NODE_ENV || 'development',
	isDev = env === 'development',
	isProd = !isDev;

//module.exports.start = gulp.series(setMode(), build, server);
//module.exports.build = gulp.series(setMode(true), build);

/* Очистка директории проекта */

task('clean', require('./tasks/clean'));
task('clean:html', require('./tasks/clean-html'));
task('clean:js', require('./tasks/clean-js'));
task('clean:webpack', require('./tasks/clean-webpack'));

/* Основные задачи */

task('build:html', require('./tasks/build-html'));
task('build:js', require('./tasks/build-js'));
task('scripts', require('./tasks/scripts'));
task('build:webpack', require('./tasks/build-webpack'));
task('watch:webpack', require('./tasks/watch-webpack'));

/* Execution */

exports.html = series('clean:html', 'build:html');
exports.js = series('clean:js', 'build:js');
exports.webpack = series('clean:webpack', 'build:webpack');

exports['build:all'] = series('clean', parallel('build:html', 'build:webpack'));
exports.build = series('clean', parallel('build:html', 'build:webpack'));

/* Files Tasks */

task('move:test', require('./tasks/move-test'));
task('move:files', require('./tasks/move-files'));
exports.move = series('clean', 'move:files');

/* Check Cmd Arguments */
exports.args = require('./tasks/args');

/* Images Tasks */

task('generate-favicon', require('./tasks/generate-favicon'));
task('check-for-favicon-update', require('./tasks/check-for-favicon-update'));

/* Development Tasks */

task('dev:html', require('./tasks/dev-html'));
task('dev:pug', require('./tasks/dev-pug'));
task('dev:scss', require('./tasks/dev-scss'));
task('dev:js', require('./tasks/dev-js'));
task('dev:img', require('./tasks/dev-img'));
task('dev:imgmin', require('./tasks/dev-imgmin'));
// Webserver
task('server', require('./tasks/server'));

/* Production Tasks */

task('sftp:push', require('./tasks/sftp-push'));
task('prod:html', require('./tasks/prod-html'));
task('prod:scss', require('./tasks/prod-scss'));
task('prod:js', require('./tasks/prod-js'));
task('watch', require('./tasks/watch'));

/* Execution */

exports.dev = series('clean', parallel('dev:html', 'dev:scss', 'dev:js', 'dev:img'/*, 'generate-favicon'*/), 'server', 'watch');
exports.prod = series('clean', parallel('prod:html', 'prod:scss', 'prod:js', 'dev:img'));

// задача по умолчанию
const { build } = exports;
exports.default = series(build);

exports._test = require('./tasks/helpers/test');
