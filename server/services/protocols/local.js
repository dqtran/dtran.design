var validator = require('validator');
var crypto    = require('crypto');

/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.register = function (req, res, next) {
  var email    = req.body.email,
      username = req.body.username,
      password = req.body.password,
      region = req.body.region,
      _user,
      err;

  if (!email) {
    err = new Error('Error.Passport.Email.Missing');
    err.status = 406;
    return next(err);
  }

  if (!username) {
    err = new Error('Error.Passport.Username.Missing');
    err.status = 406;
    return next(err);
  }

  if (!password) {
    err = new Error('Error.Passport.Password.Missing');
    err.status = 406;
    return next(err);
  }

  abe.db.User.create({
    username : username,
    email    : email,
    region: region
  })
  .then(function (user) {
    _user = user;
    // Generating accessToken for API authentication
    var token = crypto.randomBytes(48).toString('base64');

    abe.db.Passport.create({
      'protocol'    : 'local',
      'password'    : password,
      'UserId'      : user.id,
      'accessToken' : token
    })
    .then(function (passport) {

      next(null, _user);

    })
    .catch(function(err){

      abe.db.User.destroy({where: {id: _user.id}}, { returning: true })
      .then(function(destroyed){
        next(err);
      })
      .catch(function(err){
        next(err);
      });
      
    });


  })
  .catch(next);
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
  var user     = req.me,
      password = req.body.password;

  abe.db.Passport.findOne({
    protocol : 'local',
    user     : user.id
  })
  .then(function (passport) {
    if (!passport) {
      
      abe.db.Passport.create({
        protocol : 'local',
        password : password,
        user     : user.id
      })
      .then(function (passport) {
        next(null, user);
      })
      .catch(next(err));

    }
    else {
      next(null, user);
    }
  })
  .catch( next(err) );
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, identifier, password, next) {
    var isEmail = validator.isEmail(identifier),
      query   = {};

  if (isEmail) {
    query.email = identifier;
  }
  else {
    query.username = identifier;
  }

  abe.db.User.findOne({where: query })
    .then(function(user){

      if (!user) {
        if (isEmail) {
          req.flash('error', 'Error.Passport.Email.NotFound');
        } else {
          req.flash('error', 'Error.Passport.Username.NotFound');
        }

        return next(null, false);
      }


      abe.db.Passport.findOne({where: {
        protocol : 'local',
        UserId     : user.id
      }})
      .then(function (passport) {
        
        if (passport) {
          passport.validatePassword(password, function (err, res) {

            if (err) {
              return next(err);
            }

            if (!res) {
              req.flash('error', 'Error.Passport.Password.Wrong');
              var err = new Error('User login failed.');
                err.status = 401;
              return next(err);
            } else {
              return next(null, user);
            }

          });

        }
        else {

          req.flash('error', 'Error.Passport.Password.NotSet');
          return next(null, false);

        }

      })
      .catch(next);
    })
    .catch(next);
};



exports.create = function(req, current_user){

    var password = req.body.password;

    return abe.db.Passport.create({
            protocol : 'local',
            password : password,
            user     : current_user.id
        })
        .then(function(passport){
            return passport;
        })
        .catch(function(err){
            throw err;
        });

};