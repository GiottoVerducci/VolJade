// Module dependencies. Order is important

var flash = require('connect-flash');

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var login = require('./routes/login');
var http = require('http');
var path = require('path');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

// app initialization for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ key: 'sid', cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app initialization for development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// initialization of passport (used for authentication)
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// 
passport.use(new LocalStrategy(
  function (username, password, done) {
      //User.findOne({ username: username }, function (err, user) {
      //if (err) { return done(err); }
      user = { name: username };
      if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
          }
          //if (!user.validPassword(password)) {
      if (password != username) {
          return done(null, false, { message: 'Incorrect password.' + password + ' ' + username });
          }
          return done(null, user);
      //});
  }
));

// routes definition

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/login', login.index);

app.post('/login',
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  })
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
