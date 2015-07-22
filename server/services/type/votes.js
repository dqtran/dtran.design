module.exports = {

	users: [],
	votesPeruser: 5,
	votes: 0,
	results: [],

	'generate': function(voters, next){

		
		var service = this;
		var ids = service.randomArray(voters, 10);
		console.log('Generating ' + voters + ' voters!');
		service.next = next;

		// x number of users create x number of votes on matchups

		abe.db.User.findAll({ where: {id: ids } })
			.then(function(users){
				if(users){
					service.users = users;
					service.findMatchUp(0); // kick off lunch creation
				}
			})
			.catch(function(err){
				console.log(err.stack);
			});


	},

	'findMatchUp': function(current){

		var service = this;
		var user = service.users[current];

		abe.services.matchup.find(user, function(err, lunches){
			
			if(lunches){

				if(lunches.length === 2){ 

					service.vote(current, lunches);

				}else{
					current++;
					if(current >= service.users.length){
						service.complete();
					}else{
						service.findMatchUp(current);
					}
					
				}

			}else{
					current++;
					if(current >= service.users.length){
						service.complete();
					}else{
						service.findMatchUp(current);
					}
					
				}
		});


	},


	vote: function(current, lunches){

		var service = this;
		var user = service.users[current];

		abe.services.matchup.vote('regional', lunches[0].region, user.id, lunches[0].id, lunches[1].id, function(err, results){
			
			service.votes++;

			service.results.push(results);

			abe.logs.info('user:', current, 'vote:', service.votes);

			if(service.votes <= service.votesPeruser){
				service.findMatchUp(current);
			}else{

				current++;
				service.votes = 0;
				if(current >= service.users.length){
					service.complete();
					
				}else{
					service.findMatchUp(current);
				}

			}

		});

	},

	randomArray: function(length, users){

		var arr = [];
		while(arr.length < length){
		  var randomnumber=Math.ceil(Math.random()*users);
		  var found=false;
		  for(var i=0;i<arr.length;i++){
			if(arr[i]==randomnumber){found=true;break};
		  }
		  if(!found)arr[arr.length]=randomnumber;
		}
		console.log(arr);
		return arr;

	},

	complete: function(){

		
		var service = this;
		service.next(null, service.results);
		service.votes = 0;
		service.results = [];
		service.users = [];

	}
	

};


