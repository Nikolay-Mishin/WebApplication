const webpack = require('webpack');
const path = require('path');

module.exports = {
	mode: 'none', // development | production
	entry: {
		app: path.join(__dirname, '/Client/js/**/*.js')
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/wwwroot'),
		publicPath: '/wwwroot',
		// library: 'app',
		// libraryTarget: 'umd',
		globalObject: 'this'
	},
	//output: {
	//	filename: 'bundle.js',
	//},
	//output: {
	//	filename: '[name].js',
	//	path: path.join(__dirname, '/dist'),

	//	publicPath: '/dist',
	//	library: 'GameEngine',
	//	libraryTarget: 'umd',
	//	globalObject: 'this'
	//},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ["env"],
				},
			},
		],
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		modules: ['node_modules'],
		alias: {
			Utilities: path.resolve(__dirname, 'src/utilities/'),
			Templates: path.resolve(__dirname, 'src/templates/')
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};

console.log(__dirname);
console.log(path.join(__dirname, '/wwwroot'));

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
