// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import session from 'express-session';

// CONTROLLERS //


// POLICIES //
const isAuthed = (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// SERVICES //
// import passport from './services/passport.js';

// INITIALIZE APP //
const app = module.exports = express();

// INITIALIZE DEPENDENCIES //
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(__dirname + './../public'));


app.get('', function(req, res, next) {

});
app.post('', function(req, res, next) {

});
app.put('', function(req, res, next) {

});
app.delete('', function(req, res, next) {

});


// LISTEN //
app.listen(config.PORT, () => {
    console.log('listening on port ', config.PORT);
});
