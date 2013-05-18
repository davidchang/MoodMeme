var express = require('express')
  , http = require('http')
  , path = require('path')
  , redis = require('redis')
  , client = redis.createClient()
  , passport = require('passport');

require('./passport-config');

client.on('error', function(err) {
    console.log('redis error ' + err);
});


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/' }));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/', function(req, res) {
    console.log("The req.user: " );
    console.log(req.user);

    if(req.user)
        res.render('main-mood-page', { title: 'Hello ' + req.user.displayName, user: req.user });
    else
        res.render('index', { title: 'You are not yet logged in', user: req.user });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
