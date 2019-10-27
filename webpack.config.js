const webpack = require('webpack');
const path = require('path');

module.exports = {
	mode: 'none', // development | production
	devtool: 'source-map',
	output: {
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: [
						['latest', { modules: false }],
						//'es2015',
						//'react'
					],
				},
			},
		],
	},
	optimization: {
		minimize: false,
	},
	//amd: {
	//	"define.amd": true,
	//	"require.amd": true,
	//	Jquery: true
	//},
	resolve: {
		// extensions: ['', '.js', '.jsx'],
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