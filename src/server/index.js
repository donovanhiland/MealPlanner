// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import session from 'express-session';
import massive from 'massive';
import FB from 'fb';

// CONTROLLERS //


// POLICIES //
const isAuthed = (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// EXPRESS APP //
const app = module.exports = express();

// PSQL CONNECTION //
const massiveInstance = massive.connectSync({
    connectionString: config.CONNECTIONSTRING,
});
app.set('db', massiveInstance);
const db = app.get('db');

db.user_table_seed((err, res) => {
    if (err) console.log(err);
    console.log('user table init');
});

// SERVICES //
const passport = require('./services/passport.js');

// INITIALIZE DEPENDENCIES //
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: config.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + './../public'));

// GET //
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/#/home'
}));

// , function(req, res) {
//     // Successful authentication, redirect to me endpoint.
//     res.redirect('/#/');
// }

app.get('/me', function(req, res, next) {
    res.send(req.user);
});

// POST //
app.post('', function(req, res, next) {

});

// PUT //
app.put('', function(req, res, next) {

});

// DELETE //
app.delete('', function(req, res, next) {

});


// LISTEN //
app.listen(config.PORT, () => {
    console.log('listening on port ', config.PORT);
});
