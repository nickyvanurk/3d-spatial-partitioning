const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    watchFiles: ['./src/*.html', './src/*.css'],
    static: 'dist',
    open: true,
    hot: true,
  },
  module: {
    rules: [{
      test: /\.(glsl|vs|fs)$/,
      loader: 'ts-shader-loader'
    }]
  }
});