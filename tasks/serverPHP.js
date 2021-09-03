const { serverPHPconfig } = require('../gulpfile.config'),
	connectPHP = require('gulp-connect-php');

module.exports = function serverPHP() {
	return connectPHP.server(serverPHPconfig);
};
