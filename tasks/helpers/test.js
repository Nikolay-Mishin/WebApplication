const config = require('../../gulpfile.config'),
	h = require('./helpers'),
	{ setMode, arg } = require('./helpers');

module.exports = function _test(done) {
	console.log(config);

	//console.log(process);
	//console.log(process.env);
	console.log(process.argv);
	console.log(arg);

	console.log(process.env.NODE_ENV);
	console.log('dev: ' + h.dev);
	console.log('prod: ' + h.prod);

	setMode(true);
	console.log(process.env.NODE_ENV);
	console.log('dev: ' + h.dev);
	console.log('prod: ' + h.prod);

	done();
};
