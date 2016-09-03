'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _massive = require('massive');

var _massive2 = _interopRequireDefault(_massive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// CONTROLLERS //


// POLICIES //
// Require dependencies
var isAuthed = function isAuthed(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// EXPRESS APP //
var app = module.exports = (0, _express2.default)();

// PSQL CONNECTION //
var massiveInstance = _massive2.default.connectSync({
    connectionString: _config2.default.CONNECTIONSTRING
});
app.set('db', massiveInstance);
var db = app.get('db');

db.user_table_seed(function (err, res) {
    if (err) console.log(err);
    console.log('user table init');
});

// SERVICES //
var passport = require('./services/passport.js');

// INITIALIZE DEPENDENCIES //
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({
    secret: _config2.default.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(_express2.default.static(__dirname + './../public'));

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

app.get('/me', function (req, res, next) {
    res.send(req.user);
});

// POST //
app.post('', function (req, res, next) {});

// PUT //
app.put('', function (req, res, next) {});

// DELETE //
app.delete('', function (req, res, next) {});

// LISTEN //
app.listen(_config2.default.PORT, function () {
    console.log('listening on port ', _config2.default.PORT);
});