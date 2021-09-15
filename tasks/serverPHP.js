const {
	config: { serverPHPconfig },
	modules: { connectPHP }
} = require('./helpers/helpers');

module.exports = () => connectPHP.server(serverPHPconfig);
