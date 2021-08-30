const { src, dest } = require('gulp'),
	{ lastRun } = require('./helpers/helpers');

module.exports = function move_test() {
	return src('src/**/*', lastRun(move_test)).on('data', function(file) {
		console.log({
			contents: file.contents, // содержимое файла
			path: file.paths, // путь до файла
			cwd: file.cwd, // основная директория
			base: file.base, // базовая директория
			// helpers
			relative: file.relative, // имя файла относительно текущей директории
			dirname: file.dirname, // имя текущей директории
			basename: file.basename, // название файла
			stem: file.stem, // имя файла
			extname: file.extname // расширение файла
		});
	})
	.pipe(dest(function(file) {
		return file.extname == '.html' ? 'files/html' :
			file.extname == '.css' ? 'files/css' :
				file.extname == '.js' ? 'files/js' : 'files'
	}));
};
