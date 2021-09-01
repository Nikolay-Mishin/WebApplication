const { serverPHP } = require('../gulpfile.config'),
	connectPHP = require('gulp-connect-php');

module.exports = async function server_task() {
	connectPHP.server(serverPHP);
};
