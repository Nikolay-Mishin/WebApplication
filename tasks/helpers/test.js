const { arg } = require('./helpers/helpers');

module.exports = function _test(done) {
	//console.log(process);
	//console.log(process.env);
	console.log(process.argv);
	console.log(arg);
	console.log(done);
	done();
};
