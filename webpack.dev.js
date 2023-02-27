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
  cache: {
    type: 'filesystem',
    maxMemoryGenerations: 1,
  }
});