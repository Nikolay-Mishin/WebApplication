// Подключаемые модули
import { cwd } from 'process';
import webpack from 'webpack';
import { join } from 'path';
import HtmlWebpackExternalsPlugin from 'html-webpack-externals-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin'; // создает HTML-файл на основе шаблона
import { CleanWebpackPlugin } from 'clean-webpack-plugin'; // удаляет/очищает директорию сборки проекта
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Переменные проекта

const dev = (process.env.NODE_ENV || 'development') === 'development',
	prod = !dev,
	root = cwd(), // __dirname
	publicPath = 'wwwroot',
	build = join(root, publicPath),
	src = join(root, 'src'),
	filename = ext => dev ? `[name].${ext}` : `[name].[hash].${ext}`,
	optimization = () => {
		const config = {
			minimize: false
			//splitChunks: {
			//	chunks: 'all'
			//}
		};

		if (prod) {
			config.minimizer = [
				new OptimizeCssAssetWebpackPlugin(),
				new TerserWebpackPlugin()
			]
		}

		return config;
	},
	plugins = () => {
		const base = [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery'
			}),
			//new HtmlWebpackExternalsPlugin({ // optional plugin: inject cdn
			//	externals: [
			//		{
			//			module: 'jquery',
			//			entry: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
			//		}
			//	],
			//}),
			//new HTMLWebpackPlugin({
			//	template: './index.html',
			//	minify: {
			//		collapseWhitespace: prod
			//	}
			//}),
			//new CleanWebpackPlugin(),
			//new CopyWebpackPlugin([
			//	//{
			//	//	from: `${src}/favicon.ico`,
			//	//	to: build
			//	//}
			//	{
			//		from: `${src}/html`,
			//		to: `${build}/html`
			//	}
			//]),
			new MiniCssExtractPlugin({
				filename: filename('css')
			})
		]

		if (prod) {
			base.push(new BundleAnalyzerPlugin())
		}

		return base;
	},
	excludes = exclude => {
		const excludes = [
			'/(node_modules|bower_components)/'
		];

		if (exclude) {
			excludes.push(exclude);
		}

		return excludes;
	},
	cssLoaders = extra => {
		const loaders = [
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					hmr: dev,
					reloadAll: true
				},
			},
			'css-loader'
		];

		if (extra) {
			loaders.push(extra)
		}

		return loaders;
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

		if (dev) {
			//loaders.push('eslint-loader');
		}

		return loaders;
	};

export default {
	context: src,
	mode: dev ? 'development' : 'production', //none | development | production
	entry: {
		app: './js/app.js'
	},
	output: {
		filename: filename('js'),
		path: build,
		publicPath: publicPath,
		library: 'lib',
		libraryTarget: 'umd',
		globalObject: 'this'
	},
	//devServer: {
	//	port: 8080,
	//	hot: dev,
	//	contentBase: './build' // Будет запускать сервер на localhost:8080 в этой папке
	//},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.ts'],
		//import Utility from '../../utilities/utility'; => import Utility from 'Utilities/utility';
		alias: {
			'^@': build,
			'^/': src,
			//'jQuery':join(__dirname, './../../../jquery')
		}
	},
	externals: {
		jquery: 'jQuery'
	},
	optimization: optimization(),
	devtool: dev ? 'source-map' : '',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: excludes(),
				include: '/js',
				use: jsLoaders()
			},
			//{
			//	test: /\.ts$/,
			//	exclude: excludes(),
			//	include: '/ts',
			//	loader: {
			//		loader: 'babel-loader',
			//		options: babelOptions('@babel/preset-typescript')
			//	}
			//},
			//{
			//	test: /\.jsx$/,
			//	exclude: excludes(),
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
