/*
 * Bearer Authentication Protocol
 *
 * Bearer Authentication is for authorizing API requests. Once
 * a user is created, a token is also generated for that user
 * in its passport. This token can be used to authenticate
 * API requests.
 *
 */

exports.authorize = function(token, next) {
  
  abe.db.Passport.findOne({ where: { accessToken: token } })
  	.then(function(passport){

  		 if (!passport) return next(null, false);

  		 abe.db.User.findOne({ where: { id: passport.UserId } })
  		 	.then(function(user){
  		 		if (!user) return next(null, false);
	      		next(null, user, { scope: 'all' });
  		 	})
  		 	.catch(function(err){
  		 		next(err);
  		 	});

  	})
  	.catch(function(err){
  		next(err);
  	});
  
};