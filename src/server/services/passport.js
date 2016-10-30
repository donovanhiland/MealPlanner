import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import config from './../config';
import app from '../index.js';
const db = app.get('db');
import FB from 'fb';

passport.use(new FacebookStrategy({
    clientID: config.facebook.FACEBOOK_APP_ID,
    clientSecret: config.facebook.FACEBOOK_APP_SECRET,
    callbackURL: `http://127.0.0.1:9001/auth/facebook/callback`,
    profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name", "profileUrl"],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    FB.setAccessToken(accessToken);
    FB.api(profile.id, function (res) {
      if(!res || res.error) {
       console.log(!res ? 'error occurred' : res.error);
       return;
      }
      console.log(res);
    });
    db.find_or_create_user_by_id(
      profile.id,
      profile.name.givenName,
      profile.name.familyName,
    (err, dbRes) => {
      if(err)console.log(err);
      return cb(null, dbRes[0]);
    });
  }
));

passport.serializeUser((profile, done) => {
    done(null, profile);
});

passport.deserializeUser((id, done) => {
    db.users.findOne(id, (err, profile) => {
        done(err, profile);
    });
});

module.exports = passport;
