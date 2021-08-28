const gutil = require('gulp-util'), // отладка
	notify = require('gulp-notify'); // отладка

module.exports = {
	error: function(err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	},
	notify: function(title, message = 'Scripts Done') {
		return notify({
			title: title,
			message: message
		});
	}
};
