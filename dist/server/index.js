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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// CONTROLLERS //


// POLICIES //
var isAuthed = function isAuthed(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// SERVICES //
// import passport from './services/passport.js';

// INITIALIZE APP //
// Require dependencies
var app = module.exports = (0, _express2.default)();

// INITIALIZE DEPENDENCIES //
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({
    secret: _config2.default.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(_express2.default.static(__dirname + './../public'));

app.get('', function (req, res, next) {});
app.post('', function (req, res, next) {});
app.put('', function (req, res, next) {});
app.delete('', function (req, res, next) {});

// LISTEN //
app.listen(_config2.default.PORT, function () {
    console.log('listening on port ', _config2.default.PORT);
});