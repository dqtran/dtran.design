module.exports = function (app, express) {
    
    var router = express.Router();

    router.all('*', abe.policies.passport);

    router.get('/logout', abe.controllers.v0.auth.logout);

    router.post('/local', abe.controllers.v0.auth.callback);

    // 3rd party auth
    router.get('/:provider', function(req, res, next){
        abe.services.passport.endpoint(req, res);
    });

    router.get('/:provider/callback', abe.controllers.v0.auth.callback);

    router.post('/:provider/:action', abe.controllers.v0.auth.callback);


    app.use('/auth', router);

};
