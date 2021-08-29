const { imgMinify } = require('./_helpers'); // плагин расстановки префиксов

module.exports = function dev_img() {
	return imgMinify.run(function(err, files) {
		if (err) {
			throw err;
		}
		console.log('Images optimized successfully!');
	});
};
