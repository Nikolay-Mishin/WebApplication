const { serverConfig } = require('./gulpfile.config'),
	{ readyReload } = require('./_helpers'),
	{ watch, series } = require('gulp'),
	browserSync = require('browser-sync');

const imageMinify = require('./imageMinify'),
	svgSprite = require('./svgSprite'),
	styles = require('./styles'),
	pug2html = require('./pug2html'),
	scripts = require('./scripts'),
	copyDependencies = require('./copyDependencies');

module.exports = function server(done) {
	browserSync(serverConfig); // локальный сервер
	done();

	//server.init({
	//	server: 'build',
	//	notify: false,
	//	open: true,
	//	cors: true
	//});

	//watch('src/img/*.{gif,png,jpg,svg,webp}', series(imageMinify, readyReload));
	//watch('src/img/sprite/*.svg', series(svgSprite, readyReload));
	//watch('src/styles/**/*.scss', series(styles, done => gulp.src('build/css').pipe(server.stream()).on('end', done)));
	//watch('src/js/**/*.js', series(scripts, readyReload));
	//watch('src/pages/**/*.pug', series(pug2html, readyReload));

	//watch('package.json', series(copyDependencies, readyReload));

	//return done();
};
