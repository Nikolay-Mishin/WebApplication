const { imgMinify } = require('./helpers/helpers');

module.exports = function dev_img(done) {
	imgMinify.run(function(err, files) {
		if (err) {
			throw err;
		}
		console.log('Images optimized successfully!');
	});
	done();
};
