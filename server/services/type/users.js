var request = require('request');
var fs = require('fs');
var knox = require('knox');
var http = require('http');

var bucket, s3Client;

if(abe.config.env.s3){

	s3Client = knox.createClient({
	    key: abe.config.env.s3.key,
	  	secret: abe.config.env.s3.secret,
	  	bucket: abe.config.env.s3.bucket
	});
}

module.exports = {

	users: [],

	'generate': function(total, next){

		console.log('Generating ' + total + ' users!');

		var service = this,
			json,
			results;

		service.next = next;

		var options = {
			// DOCS: random user api - https://randomuser.me/documentation#format
			url: 'http://api.randomuser.me?format=json&results=' + total,
			headers: {
				'Accepts': 'application/json'
			}
		};

		request.get(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    json = JSON.parse(body);
		    results = json.results;

		    _.each(results, function(result){

		    	var user = {
		    		username: result.user.username,
		    		password: 'password',
		    		email: result.user.email,
		    		region: _.sample(['east', 'central', 'mountain', 'west']),
		    		name: result.user.name.first + ' ' + result.user.name.last,
		    		photo: result.user.picture.large
		    	};

		    	service.users.push(user);

		    });	

		    service.create(0); //kick off the creation in an ordered fashion

		  }
		});
	},

	'create': function(current) {

		var service = this;
		var user = service.users[current];
		var protocol = (process.env.NODE_ENV !== 'local') ? 'https:' : 'http:';

		var url = protocol + abe.config.env.baseURL + 'auth/local/register';
		abe.logs.debug('url: ' + url);

		var options = {
			url: url,
			headers: {
				'Accept': 'application/json'
			},
			form: user
		};

		request.post(options, function(err, res, body){

			if(err) console.log(err);

			if(res.statusCode === 200 || res.statusCode === 302){
				// console.log('body', body);
				if(current < service.users.length){
					// update user profile
					service.update(current);
				}else{
					console.log('Successfully created ' + service.users.length + ' users!');
				}

			}

		});

	},

	'update': function(current){

		var service = this;
		var _user = service.users[current];

		var name = 'profile.jpg';
		var dir = abe.config.env.root + '/.tmp/uploads/' + _user.username;
		var path = dir + '/' + name;
		var url = '/uploads/' + _user.username + '/' + name;


		if(!abe.config.env.s3){
			if (!fs.existsSync(dir)){
			    fs.mkdir(dir, function(err){
			    	request.get(_user.photo).pipe(fs.createWriteStream(path));
			    });
			}else{
				request.get(_user.photo).pipe(fs.createWriteStream(path));
			}
		}else{



			http.get(_user.photo, function(res){
			  var headers = {
			    'Content-Length': res.headers['content-length'],
			    'Content-Type': res.headers['content-type'],
			    'x-amz-acl': 'public-read'
			  };
			  s3Client.putStream(res, url, headers, function(err, res){
			    if(err) abe.logs.error(err.stack);
			  });
			});

		}
		

		abe.db.User.findOne({where: {username: _user.username}})
		.then(function(user){
			

			abe.db.Photo.findOrCreate({where: {id: user.ProfilePhotoId}, defaults: { original: url } })
			.then(function(photos){

				var userPhoto = photos[0];

				user.motto = 'I love rock and roll.';
				user.name = _user.name;
				user.ProfilePhotoId = userPhoto.id;

				user.save()
					.then(function(user){
						current++;
						if(current < service.users.length){
							service.create(current);
						}else{
							service.complete();
						}
					})
					.catch(function(err){
						throw err;
					});

			});

		})
		.catch(function(err){
			 return service.next(err);
		});


	},

	complete: function(){

		var service = this;

		abe.db.User.findAndCountAll({ include: [{model: abe.db.Photo, as: 'ProfilePhoto'}] })
			.then(function(users){

				service.users = [];
				users = JSON.stringify(users);
				users = JSON.parse(users);
				abe.logs.debug("User generation complete");
				service.next(null, users);
				
			})
			.catch(function(err){
				service.users = [];
				return service.next(err);
			});
	}
	

};


