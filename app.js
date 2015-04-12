var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var users = require('./routes/users');

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var TOKENS_FB = require('./tokens/facebook.js');

var callbackURL = process.env.LOCAL ? "http://localhost:3000/auth/facebook/callback" : 'http://direct.phckopper.org:3000/auth/facebook/callback';

console.log(callbackURL);

passport.use(new FacebookStrategy({
    clientID: TOKENS_FB.clientID,
    clientSecret: TOKENS_FB.clientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  var data = {
    id: user.id,
    name: user.displayName
  }
  console.log(data);
  done(null, data);
});

passport.deserializeUser(function(data, done) {
  done(null, data);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'bananajacare',
  store: new MongoStore({ url: 'mongodb://localhost/sessions-tro' })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/api', users);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/auth/facebook' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
