var passport = require('passport')
  , config = require('./config')
  , redis = require('redis')
  , client = redis.createClient()
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback'
},
    function(accessToken, refreshToken, userData, done) {
        client.get('users', function(err, reply) {

            if(err) {
                done(err); return;
            }

            var allUsers = {};
            if(reply != null) {
                try {
                    allUsers = JSON.parse(reply);
                    if(allUsers[userData.id]) {
                        done(null, allUsers[userData.id]);
                        return;
                    }
                } catch (err) { }
            }

            allUsers[userData.id] = userData;
            
            client.set('users', JSON.stringify(allUsers), function(err, reply) {
                if(err) { done(err); return; }

                done(null, userData);   
            });
        });
    })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  client.get('users', function(err, reply) {
    try {
        var allUsers = JSON.parse(reply);
        done(err, allUsers[id]);
    } catch (err) { done("could not deserialize user"); }
  });
});
