/* === Import dependencies == */
import express from 'express';
import session from 'express-session';
import graphQLHTTP from 'express-graphql';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import cors from 'cors';
import path from 'path';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import config from './config/environment';
import webpackConfig from '../../webpack.config.babel';
import { Schema } from './data/schema.js';

/* === CONTROLLERS === */

/* === POLICIES === */

if (config.env === 'development') {
  // Launch GraphQL
  const graphql = express();
  graphql.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema
  }));
  graphql.listen(config.graphql.port, () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)));

  // Launch Relay by using webpack.config.js
  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/',
    proxy: {
      // '/graphql': `http://localhost:${config.graphql.port}`
      '/graphql': 'http://localhost:3000'
    },
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    hot: true,
    historyApiFallback: true
  });

  // Serve static resources
  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
} else if (config.env === 'production') {
  // Launch Relay by creating a normal express server
  const relayServer = express();
  relayServer.use(cors());
  relayServer.use(historyApiFallback());
  relayServer.set('trust proxy', 1); // trust first proxy
  relayServer.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true
    },
  }));
  relayServer.use('/', express.static(path.join(__dirname, '../public')));
  relayServer.use('/graphql', graphQLHTTP({
    schema: Schema
  }));
  relayServer.listen(3000, () => {
    console.log(chalk.green(`Relay is listening on port ${3000}`));
  });
}
