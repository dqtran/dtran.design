module.exports = {


    'logout': function(req, res, next){
        
        if(req.user){
          var user = req.user;
            req.logout();
            req.session.authenticated = false;
            req.session.destroy();
            res.view('logout', user);
        }else{
            next(new Error('No user to logout.'));
        }

    },
    
    'callback': function(req, res, next){

        var data = req.body;

        function tryAgain (err) {

          // Only certain error messages are returned via req.flash('error', someError)
          // because we shouldn't expose internal authorization errors to the user.
          // We do return a generic error and the original request body.
          var flashError = req.flash('error')[0];

          if (err && !flashError ) {
            abe.logs.error(err);
            req.flash('error', 'Error.Passport.Generic');
          } else if (flashError) {
            req.flash('error', flashError);
          }

          req.flash('form', req.body);

          // If an error was thrown, redirect the user to the
          // login, register or disconnect action initiator view.
          // These views should take care of rendering the error messages.
          var action = req.params.action;
          // TODO: return errors if JSON request
          switch (action) {
            case 'register':
              res.redirect('back');
              break;
            case 'disconnect':
              res.redirect('back');
              break;
            default:
              res.redirect('/auth/login');
          }
        }

        abe.services.passport.callback(req, res, function (err, user) {

            if (err || !user) {
              return next(err);
            }

            if(user){
              req.login(user, function (err) {

                      if (err) {
                        return next(err);
                      }
                      res.redirect('/welcome');

                  });
            }

        });

    }

};
