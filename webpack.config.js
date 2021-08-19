// Подключаемые плагины

const webpack = require('webpack'),
	path = require('path'),
	HTMLWebpackPlugin = require('html-webpack-plugin'), // создает HTML-файл на основе шаблона
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'), // удаляет/очищает директорию сборки проекта
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
	TerserWebpackPlugin = require('terser-webpack-plugin'),
	{ BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Переменные проекта

const isDev = process.env.NODE_ENV === 'development',
	isProd = !isDev,
	root = 'wwwroot',
	dist = path.resolve(__dirname, 'wwwroot'),
	src = path.resolve(__dirname, 'src');

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	}

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}

	return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true
			},
		},
		'css-loader'
	]

	if (extra) {
		loaders.push(extra)
	}

	return loaders
}

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

const plugins = () => {
	const base = [
		new webpack.ProvidePlugin({
			$: 'jQuery',
			jQuery: 'jQuery'
		}),
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProd
			}
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{
			from: `${src}/favicon.ico`,
			to: dist
		}]),
		new MiniCssExtractPlugin({
			filename: filename('css')
		})
	]

	if (isProd) {
		base.push(new BundleAnalyzerPlugin())
	}

	return base
}

module.exports = {
	//context: src,
	mode: 'development', //none | development | production
	entry: {
		app: './src/js/app.js',
		main: './src/js/ts/app.js'
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
		//modules: ['node_modules'],
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
	//optimization: optimization(),
	//devServer: {
	//	port: 8080,
	//	hot: isDev,
	//	contentBase: './dist' // Будет запускать сервер на localhost:8080 в этой папке
	//},
	devtool: 'source-map',
	//devtool: isDev ? 'source-map' : '',
	//plugins: plugins(),
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
			//{
			//	test: /\.css$/,
			//	use: cssLoaders()
			//},
			//{
			//	test: /\.less$/,
			//	use: cssLoaders('less-loader')
			//},
			//{
			//	test: /\.s[ac]ss$/,
			//	use: cssLoaders('sass-loader')
			//},
			//{
			//	//test: /\.(png|jpg|svg|gif)$/,
			//	//test: /\.(?:ico|gif|png|jp(e)g)$/i,
			//	test: /\.(png|jp(e)g|svg|gif)$/,
			//	use: ['file-loader']
			//	//type: 'asset/resource',
			//},
			//{
			//	//test: /\.(ttf|woff|woff2|eot)$/,
			//	test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
			//	use: ['file-loader']
			//	//type: 'asset/inline',
			//},
			//{
			//	test: /\.xml$/,
			//	use: ['xml-loader']
			//},
			//{
			//	test: /\.csv$/,
			//	use: ['csv-loader']
			//},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: './src/js',
				//use: jsLoaders(),
				loader: 'babel-loader',
				query: babelOptions(),
			},
			//{
			//	test: /\.ts$/,
			//	exclude: /(node_modules|bower_components)/,
			//	include: './ts',
			//	loader: {
			//		loader: 'babel-loader',
			//		options: babelOptions('@babel/preset-typescript')
			//	}
			//},
			//{
			//	test: /\.jsx$/,
			//	exclude: /(node_modules|bower_components)/,
			//	include: '/react',
			//	loader: {
			//		loader: 'babel-loader',
			//		options: babelOptions('@babel/preset-react')
			//	}
			//}
		],
	}
};

console.log(__dirname);
console.log(dist);

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
