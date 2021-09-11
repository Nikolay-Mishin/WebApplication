const { log } = console,
	{ args: _args } = require('./helpers/helpers');

module.exports = async function args() { log(_args); };
