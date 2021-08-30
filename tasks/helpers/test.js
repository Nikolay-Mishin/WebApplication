const config = require('../../gulpfile.config'),
	h = require('./helpers'),
	{ arg, setMode } = h;

module.exports = function test(done) {
	//console.log('process\n', process);
	console.log('config\n', config);
	//console.log('env\n', process.env);
	//console.log('argv\n', process.argv);
	console.log('arg\n', arg);
	console.log('useWebpack: ', h.useWebpack);

	const log = { [h.mode]: {} };

	if (h.dev) {
		log[h.mode].NODE_ENV = process.env.NODE_ENV;
		log[h.mode].dev = h.dev;
		log[h.mode].prod = h.prod;
	}

	setMode(true);
	log[h.mode] = {};

	if (h.prod) {
		log[h.mode].NODE_ENV = process.env.NODE_ENV;
		log[h.mode].dev = h.dev;
		log[h.mode].prod = h.prod;
	}

	console.log('log\n', log);

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
