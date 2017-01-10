/* eslint-disable no-console */
/* === Import dependencies == */
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';
import config from './config/environment';
import webpackConfig from '../../webpack.config.babel';

/* === CONTROLLERS === */

/* === POLICIES === */

if (config.env === 'development') {
  const devServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/',
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
    hot: true,
    historyApiFallback: true,
  });

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.listen(config.port, () => {
    console.log(chalk.green(`Listening on port ${config.port}`));
  });
} else if (config.env === 'production') {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(session({ secret: config.SESSION_SECRET, saveUninitialized: false, resave: false }));
  app.use('/', express.static(path.join(__dirname, '../build')));

  app.listen(3000, () => {
    console.log(chalk.green(`Listening on port ${3000}`));
  });
}
