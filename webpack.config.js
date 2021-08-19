// Подключаемые плагины

const webpack = require('webpack'),
	path = require('path');

// Переменные проекта

const isDev = process.env.NODE_ENV === 'development',
	isProd = !isDev,
	root = 'wwwroot',
	dist = path.resolve(__dirname, 'wwwroot'),
	src = path.resolve(__dirname, 'src');

const babelOptions = preset => {
	const opts = {
		presets: [
			'@babel/preset-env'
		],
		plugins: [
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-transform-runtime'
		]
	};

	if (preset) {
		opts.presets.push(preset);
	}

	return opts;
};

const jsLoaders = () => {
	const loaders = [{
		loader: 'babel-loader',
		options: babelOptions()
	}];

	if (isDev) {
		loaders.push('eslint-loader');
	}

	return loaders;
};

module.exports = {
	context: src,
	mode: 'development', //none | development | production
	entry: {
		app: './js/app.js',
		main: './js/ts/app.js'
	},
	output: {
		filename: '[name].js',
		path: dist,
		publicPath: `/${root}`,
		library: 'src',
		libraryTarget: 'umd', //umd, amd
		globalObject: 'this'
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.ts'],
		//import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
		alias: {
			'^@': dist,
			'^/': src
		}
	},
	optimization: {
		minimize: false,
	},
	devtool: 'source-map',
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jQuery',
			jQuery: 'jQuery'
		})
	],
	//externals: {
	//	jquery: 'jQuery'
	//},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: './js',
				use: jsLoaders(),
				//loader: 'babel-loader',
				//query: babelQuery(),
			},
		],
	}
};

console.log(__dirname);
console.log(dist);

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
