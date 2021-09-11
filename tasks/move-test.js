const { log } = console,
	h = require('./helpers/helpers'),
	{
		lastRun,
		modules: { gulp: { dest }, changed }
	} = h;

module.exports = function move_test() {
	const { tasks: { data } } = h;
	return data('src/**/*')
		//.pipe(changed('www', { hasChanged: changed.compareContents }))
		//.pipe(dest('www'))
		.pipe(dest(function (file) {
			return file.extname == '.html' ? 'files/html' :
				file.extname == '.css' ? 'files/css' :
				file.extname == '.js' ? 'files/js' : 'files'
		}));
};
