module.exports = function (req, res, next) {
  // Initialize Passport
  abe.services.passport.initialize()(req, res, function () {
    // Use the built-in sessions
    abe.services.passport.session()(req, res, function () {
      // Make the user available throughout the frontend\
      res.locals.me = req.user;
      
    if(req.user){
        req.session.authenticated = true;
        next();
    }else{
        next();
    }

    });
  });
};