// Подключаемые плагины

const webpack = require('webpack'),
	path = require('path');
HTMLWebpackPlugin = require('html-webpack-plugin'), // создает HTML-файл на основе шаблона
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'), // удаляет/очищает директорию сборки проекта
	CopyWebpackPlugin  = require('copy-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
	TerserWebpackPlugin = require('terser-webpack-plugin'),
	{ BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Переменные проекта

const build = path.resolve(__dirname, 'wwwroot'),
	src = path.resolve(__dirname, 'src'),
	root = 'wwwroot',
	isDev = true,
	//isDev = process.env.NODE_ENV === 'development',
	isProd = !isDev,
	filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`,
	devServer = {
		port: 8080,
		hot: isDev,
		contentBase: './build' // Будет запускать сервер на localhost:8080 в этой папке
	},
	resolve = {
		modules: ['node_modules'],
		extensions: ['.js', '.ts'],
		//import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
		alias: {
			'^@': build,
			'^/': src,
			'jQuery': path.resolve(__dirname, './../../../jquery')
		}
	},
	optimization = () => {
		const config = {
			minimize: false
			//splitChunks: {
			//	chunks: 'all'
			//}
		}

		if (isProd) {
			config.minimizer = [
				new OptimizeCssAssetWebpackPlugin(),
				new TerserWebpackPlugin()
			]
		}

		return config
	},
	cssLoaders = extra => {
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
	},
	babelOptions = preset => {
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
	},
	jsLoaders = () => {
		const loaders = [{
			loader: 'babel-loader',
			options: babelOptions()
		}];

		if (isDev) {
			//loaders.push('eslint-loader');
		}

		return loaders;
	},
	plugins = () => {
		const base = [
			new webpack.ProvidePlugin({
				$: 'jQuery'
			}),
			//new HTMLWebpackPlugin({
			//	template: './index.html',
			//	minify: {
			//		collapseWhitespace: isProd
			//	}
			//}),
			//new CleanWebpackPlugin(),
			//new CopyWebpackPlugin([{
			//	from: `${src}/favicon.ico`,
			//	to: build
			//	//patterns: [
			//	//	{
			//	//		from: `${src}/favicon.ico`,
			//	//		to: build
			//	//	},
			//	//],
			//}]),
			//new MiniCssExtractPlugin({
			//	filename: filename('css')
			//})
		]

		if (isProd) {
			base.push(new BundleAnalyzerPlugin())
		}

		return base
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
		//filename: filename('js'),
		path: build,
		globalObject: 'this'
		//publicPath: `/${root}`,
		//library: 'src',
		//libraryTarget: 'umd', //umd, amd
	},
	//devServer: devServer,
	resolve: resolve,
	optimization: optimization(),
	devtool: isDev ? 'source-map' : '',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: '/js',
				use: jsLoaders()
			},
			//{
			//	test: /\.ts$/,
			//	exclude: /(node_modules|bower_components)/,
			//	include: '/ts',
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
			//},
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
			//}
		],
	}
};

console.log(__dirname);
console.log(build);

console.log(module.exports.entry.app);
console.log(module.exports.output.path);
