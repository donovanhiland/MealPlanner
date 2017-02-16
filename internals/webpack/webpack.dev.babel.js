const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new webpack.NoErrorsPlugin(),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),
  new HtmlWebpackPlugin({
    title: 'React App',
    template: './app/index.template.html',
    mobile: true,
    inject: true,
  }),
];

module.exports = require('./webpack.base.babel')({
  // Add hot reloading in development
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.join(process.cwd(), 'app/index.jsx'),
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  // Add development plugins
  plugins, // eslint-disable-line no-use-before-define

  // Emit a source map for easier debugging
  devtool: 'cheap-module-eval-source-map', // TODO: LOOKUP DEVTOOL OPTIONS

  performance: {
    hints: false, // TODO: LOOKUP PERFORMANCE
  },
});
