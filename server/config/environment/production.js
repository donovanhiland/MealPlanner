module.exports = {
  // Put your production configuration here
  PG_CONNECTION_URI: process.env.HEROKU_POSTGRESQL_BLUE_URL || 'postgres://donovanhiland@localhost:5432/local_dev',
  LOG_LEVEL: 'info',
};
