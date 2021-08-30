const config = require('../../gulpfile.config'),
	h = require('./helpers'),
	{ arg, setMode } = h;

module.exports = async function test(done) {
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

	for (let key in log) {
		console.log(`${key}: `, log[key]);
	}

	console.log('exports\n', exports);

	console.log('test\n', test);

	console.log('this\n', this);

	console.log('done\n', done);

	//done();
	return this;
};
