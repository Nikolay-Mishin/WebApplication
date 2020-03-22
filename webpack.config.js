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
		app: './Client/js/app.js',
		main: './Client/js/ts/app.js',
		//Amd: './Client/js/main.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'wwwroot'),
		publicPath: '/wwwroot',
		//library: 'Amd',
		//libraryTarget: 'amd', // umd, amd
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /(node_modules|bower_components)/,
				include: path.resolve(__dirname, 'Client/js'),
				loader: 'babel-loader',
				query: {
					presets: ["env"],
				},
			},
		],
	},
	devtool: 'source-map',
	optimization: {
		minimize: false,
	},
	externals: {
		jquery: 'jQuery'
	},
	resolve: {
		modules: ['node_modules'],
		//extensions: ['', '.js', '.ts'],
		// import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
		alias: {
			Utilities: path.resolve(__dirname, 'src/utilities/')
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jQuery',
			jQuery: 'jQuery'
		})
	]
};

console.log(__dirname);
console.log(path.resolve(__dirname, 'wwwroot'));

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
