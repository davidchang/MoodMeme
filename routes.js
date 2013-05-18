module.exports.setRoutes = function(app, passport) {
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

    app.post('/mood', function(req, res) {
        console.log("RECEIVED THIS SET OF MOODS: " + req.body.mood);
    });

    app.post('/moodEvent', function(req, res) {
        console.log("RECEIVED THIS MOOD EVENT: " + req.body.moodEvent);
    });

}
