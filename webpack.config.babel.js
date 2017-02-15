const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

let appEntry;
let devtool;
let plugins;

const htmlTemplate = new HtmlWebpackPlugin({
  title: 'Meal Planner App',
  template: './src/client/index.template.html',
  mobile: true,
  inject: false,
});
// const favIcon = new FaviconsWebpackPlugin('./src/client/assets/logo.png');

if (process.env.NODE_ENV === 'production') {
  appEntry = [path.join(__dirname, 'src/client/index.jsx')];
  devtool = 'source-map';
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
      },
    }),
    htmlTemplate,
    // favIcon
  ];
} else {
  appEntry = [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src/client/index.jsx'),
  ];
  devtool = 'eval';
  plugins = [
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
    htmlTemplate,
    // favIcon
  ];
}

module.exports = {
  entry: {
    app: appEntry,
    // vendor: ['react', 'react-dom', 'react-relay', 'react-router']
  },
  output: {
    path: path.join(__dirname, 'build', 'public'),
    publicPath: '/',
    filename: '[name].js',
  },
  devtool,
  module: {
    preLoaders: [{
      test: /\.jsx$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    }],
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.scss$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1' +
          '&localIdentName=[name]__[local]___[hash:base64:5]!postcss',
      ],
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[hash].[ext]',
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  postcss: () => [precss, autoprefixer],
  plugins,
};
