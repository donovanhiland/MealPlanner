'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = _index2.default.get('db');

_passport2.default.use(new _passportFacebook.Strategy({
  clientID: _config2.default.facebook.FACEBOOK_APP_ID,
  clientSecret: _config2.default.facebook.FACEBOOK_APP_SECRET,
  callbackURL: 'http://127.0.0.1:9001/auth/facebook/callback',
  profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name"]
}, function (accessToken, refreshToken, profile, cb) {
  db.find_or_create_user_by_id(profile.id, profile.name.givenName, profile.name.familyName, function (err, dbRes) {
    if (err) console.log(err);
    return cb(null, dbRes[0]);
  });
}));

_passport2.default.serializeUser(function (profile, done) {
  done(null, profile);
});

_passport2.default.deserializeUser(function (id, done) {
  db.users.findOne(id, function (err, profile) {
    console.log('passport deserialize', profile);
    done(err, profile);
  });
});

module.exports = _passport2.default;