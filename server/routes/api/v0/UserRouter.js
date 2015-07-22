module.exports = function (app, express) {
    
    var router = express.Router();

    router.all('*', abe.policies.passport);

    router.param('user', function(req, res, next, username) {

        // try to get the user details from the User model and attach it to the request object
        abe.services.user.getByUsername(username, function(err, response){

            if(err) return next(err);
            if(response.user) res.locals.user = response.user;
            if(response.user) res.locals.currentLunch = response.lunch;
            next();

        });

    });

    router.get('/', function(req, res, next){
        abe.db.User.count({})
        .then(function(count) {
            if (count) {
                res.send({model: 'User', total: count});
            } else {
                next(new Error('failed to load user'));
            }
        })
        .catch(next);
    });

    router.get('/list', function(req, res, next){

        var limit = 10;
        var skip = 0;

        abe.db.User.findAndCountAll({limit: limit, skip: skip, include: [{model: abe.db.Photo, as: "ProfilePhoto"}]})
            .then(function(users){

                var response = {
                    users: users
                };

                res.send(response);
            })
            .catch(function(err){
                next(err);
            });
    });

    router.get('/:user', function(req, res, next){

        var response = {
            user: res.locals.user,
            // currentLunch: res.locals.currentLunch
        };

        res.send(response);
    });

    

    // router.get('/:user/lunches', function(req, res, next){

    //     var user = res.locals.user;

    //     abe.services.lunch.getByUserId(user.id, function(err, lunches){

    //         if(err) return next(err)
    //         var response = {
    //             user: res.locals.user,
    //             lunches: lunches
    //         };

    //         res.send(response);

    //     });

        
    // });

    router.post('/', [abe.policies.permissionAuth], abe.controllers.user.update);

    app.use('/v0/user', router);

};