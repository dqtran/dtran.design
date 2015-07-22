module.exports = function(req, res, next){

	if(req.user){

		var query = {
			where:{
				UserId: req.user.id,
				provider: 'github'
			}
		};

		abe.db.Passport.findOne(query)
		.then(function(passport){
			if(!passport) return next(new Error('User has not been authenticated with Github'));
			req.token = {};
			req.token.github = passport.accessToken;

			abe.services.github.init(req.token.github);

			next();

		})
		.catch(function(err){
			next(err);
		});

	}else{
		next(new Error('User is not logged in.'));
	}

};