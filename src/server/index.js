/* eslint-disable no-console */
/* === Import dependencies == */
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import cors from 'cors';
import chalk from 'chalk';
import util from 'util';
import connectMongo from 'connect-mongo';
import config from './config/environment';
import webpackConfig from '../../webpack.config.babel';
// import router from './config/routes/express4_routes'; // express 4 routes
import { register } from './config/routes/flauta_routes'; // flauta routes

const MongoStore = connectMongo(session);

if (config.env === 'development') {
  webpackConfig.entry.app.unshift('webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server');
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, {
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
  devServer.listen(8080, () => {
    console.log(chalk.bgBlue(`DevServer listening on port 8080`));
  });

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(session({
    secret: (0 | Math.random() * 6.04e7).toString(36),
    store: new MongoStore({ url: config.MONGO_STORE_URI }),
    saveUninitialized: true,
    resave: true,
  }));
  // Logs on every request
  app.use((req, res, next) => {
    console.log(chalk.cyan(`Request to: ${req.url}`));
    console.log(chalk.cyan('Params: ', util.inspect(req.params, false, null)));
    next();
  });
  // app.use('/', router); // express 4 routes
  register(app);

  app.listen(config.port, () => {
    console.log(chalk.inverse(`Express listening on port ${config.port}`));
  });
} else if (config.env === 'production') {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(session({
    secret: (0 | Math.random() * 6.04e7).toString(36),
    store: new MongoStore({ url: config.MONGO_STORE_URI }),
    saveUninitialized: true,
    resave: true,
  }));
  // app.use('/', router); // express 4 routes
  register(app);

  app.listen(config.port, () => {
    console.log(chalk.inverse(`Express listening on port ${config.port}`));
  });
}
