/* eslint-disable no-console */
/* === Import dependencies == */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const util = require('util');
const { resolve } = require('path');
const Sequelize = require('sequelize');
const winston = require('winston');
const config = require('./config/environment');
const router = require('./config/routes'); // express 4 routes
const setup = require('./middleware/frontendMiddleware.js');

// initialize db connection
const sequelize = new Sequelize(config.PG_CONNECTION_URI, { logging: false });
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({ db: sequelize });
// set logger level
winston.level = config.LOG_LEVEL;

const app = express();

setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: (0 | Math.random() * 6.04e7).toString(36),
  store: sessionStore,
  saveUninitialized: true,
  resave: true,
}));
// logs on every request
app.use((req, res, next) => {
  winston.info(chalk.cyan(`Request to: ${req.url}`));
  winston.info(chalk.cyan('Params: ', util.inspect(req.params, false, null)));
  winston.info(chalk.cyan('Query: ', util.inspect(req.query, false, null)));
  next();
});
// express 4 routes
app.use('/', router);

const customHost = argv.host || process.env.HOST;
// const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

sessionStore.sync().then(() => {
  app.listen(config.port, () => {
    winston.info(`${chalk.cyan('* Server started !')} ${chalk.green('✓')}`);
    winston.info(chalk.cyan(`* Environment: ${config.env}`));
    winston.info(chalk.cyan(`* Express listening on http://${prettyHost}:${config.port}`));
    if (process.env.NODE_ENV === 'development') {
      app.get('devServer').listen(8080, () => {
        console.log(chalk.bgBlue(`DevServer listening on port 8080`));
      });
    }
  });
});
