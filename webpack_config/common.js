const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prodMode = process.env.NODE_ENV === 'production';
const root = resolve(__dirname, '../');

module.exports = {
  entry: {
    index: join(root, 'src/index.js'),
  },
  output: {
    path: join(root, 'dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/chunks/[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: [prodMode ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: { outputPath: 'images/' },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '常用组件封装',
      template: join(root, 'src/index.html'),
    }),
  ],
  resolve: {
    alias: {
      '@components': join(root, 'src/components'),
    },
    extensions: ['.js', '.jsx']
  },
};
