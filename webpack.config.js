const webpack = require('webpack');
const path = require('path');

module.exports = {
	mode: 'none', //development | production
	entry: {
		app: './Client/js/app.js',
		main: './Client/js/ts/app.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'wwwroot'),
		publicPath: '/wwwroot',
		library: 'Client',
		libraryTarget: 'umd', //umd, amd
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
		//import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
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
