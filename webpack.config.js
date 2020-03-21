const webpack = require('webpack');
const path = require('path');

//module.exports = {
//	entry: {
//		GameEngine: './engine/index.js',
//		app: './game/index.js'
//	},
//	output: {
//		filename: '[name].js',
//		path: path.join(__dirname, '/dist'),
//		publicPath: '/dist',
//		library: 'GameEngine',
//		libraryTarget: 'umd',
//		globalObject: 'this'
//	},
//	module: {
//		rules: [{
//			test: /\.js$/,
//			loader: 'babel-loader',
//			exclude: '/node_modules/'
//		}]
//	},
//	devServer: {
//		overlay: true
//	}
//}

module.exports = {
	mode: 'none', // development | production
	entry: {
		app: path.join(__dirname, '/Client/js/app.js')
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/wwwroot'),
		publicPath: '/wwwroot',
		//library: 'App',
		//libraryTarget: 'umd',
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ["env"],
				},
			},
		],
	},
//	devtool: 'source-map',
//	optimization: {
//		minimize: false,
//	},
//	resolve: {
//		modules: ['node_modules'],
//		//alias: {
//		//	Utilities: path.resolve(__dirname, 'src/utilities/'),
//		//	Templates: path.resolve(__dirname, 'src/templates/')
//		//}
//	},
//	plugins: [
//		new webpack.ProvidePlugin({
//			$: "jquery",
//			jQuery: "jquery"
//		})
//	]
};

console.log(__dirname);
console.log(path.join(__dirname, '/wwwroot'));

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
