module.exports = {
  // Put your production configuration here
  PG_CONNECTION_URI: process.env.HEROKU_POSTGRESQL_BLUE_URL || 'postgres://user:pass@host:5432/dbname',
  LOG_LEVEL: 'info',
};
