const webpack = require('webpack'),
	path = require('path');

const root = path.resolve(__dirname, 'wwwroot'),
	src = path.resolve(__dirname, 'src');

module.exports = {
	mode: 'none', //development | production
	entry: {
		app: './src/js/app.js',
		main: './src/js/ts/app.js',
	},
	output: {
		filename: '[name].js',
		path: root,
		publicPath: '/wwwroot',
		library: 'src',
		libraryTarget: 'umd', //umd, amd
		globalObject: 'this',
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.ts'],
		//import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
		alias: {
			'^@': root,
			'^/': src,
		}
	},
	optimization: {
		minimize: false,
	},
	devtool: 'source-map',
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jQuery',
			jQuery: 'jQuery',
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: `${src}/js`,
				loader: 'babel-loader',
				query: {
					presets: ["env"],
				},
			},
		],
	},
	externals: {
		jquery: 'jQuery',
	},
};

console.log(__dirname);
console.log(root);

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
