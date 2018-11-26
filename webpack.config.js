const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: path.resolve(__dirname, 'js/app.js'),
    main: path.resolve(__dirname, 'scss/style.scss'),
    critical: path.resolve(__dirname, 'scss/critical.scss'),
    icons: path.resolve(__dirname, 'scss/icons.scss')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: 'RTD Shared Styles Demonstration Template',
      template: path.resolve(__dirname, 'demo/index.html')
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        use: ['svg-url-loader', 'img-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo/assets')
  }
};

module.exports = config;
