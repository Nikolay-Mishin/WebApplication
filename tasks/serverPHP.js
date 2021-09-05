const {
	config: { serverPHPconfig },
	modules: { connectPHP }
} = require('./helpers/helpers');

module.exports = function serverPHP() {
	return connectPHP.server(serverPHPconfig);
};
