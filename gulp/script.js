const gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	webpack = require('webpack-stream'),
	CircularDependencyPlugin = require('circular-dependency-plugin'),
	DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin"),
	eslint = require('gulp-eslint');

module.exports = function script() {
  return gulp.src('src/js/main.js')
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(webpack({
      mode: process.env.NODE_ENV,
      output: {
        filename: '[name].min.js',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      plugins: [
        new CircularDependencyPlugin(),
        new DuplicatePackageCheckerPlugin()
      ]
    }))
    .pipe(gulp.dest('build/js'))
}

