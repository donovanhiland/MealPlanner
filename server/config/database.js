const config = require('./environment');

module.exports = {
  development: {
    url: config.PG_CONNECTION_URI,
    dialect: 'postgres',
  },
  test: {
    url: config.PG_CONNECTION_URI,
    dialect: 'postgres',
  },
  production: {
    url: config.PG_CONNECTION_URI,
    dialect: 'postgres',
  },
};
