const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
  devServer: {
    host: '0.0.0.0',
    port: '3000',
    disableHostCheck: true,
    hot: true,
    historyApiFallback: true,
  },
});
