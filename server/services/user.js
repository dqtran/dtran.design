module.exports = {
    
	getById: function(id, next){

		var query = {
            where: {id: id},  
            include: [{ model: abe.db.Photo, as: 'ProfilePhoto' }]
        };

        findUser(query, next);

	},
	getByUsername: function(username, next){

		var query = {
            where: {username: username},  
            include: [{ model: abe.db.Photo, as: 'ProfilePhoto' }]
        };

        findUser(query, next);

	},

    random: function(region, next){

        var query = {
            where: {},
            order: [[abe.db.sequelize.fn('RANDOM')]]
        };

        if(region) query.where.region = region;

        abe.db.User.findOne(query)
            .then(function(user){
                if(!user) throw new Error('No User found');
                next(null, user);
            })
            .catch(next);

    }

};


function findUser(query, next){

	 abe.db.User.findOne(query)
        .then(function(user) {

        	next(null, user);
            
        })
        .catch(next);

}


