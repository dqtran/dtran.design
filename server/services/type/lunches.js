var request = require('request');
var fs = require('fs');
var crypto = require('crypto');
var MultiPartUpload = require('knox-mpu');

var knox = require('knox');
var http = require('http');

var bucket, 
	s3Client, 
	upload = null;

if(abe.config.env.s3){

	s3Client = knox.createClient({
	    key: abe.config.env.s3.key,
	  	secret: abe.config.env.s3.secret,
	  	bucket: abe.config.env.s3.bucket
	});
}

module.exports = {

	users: [],
	lunches: [],

	'generate': function(total, next){

		console.log('Generating ' + total + ' lunches!');
		var service = this;
		
		abe.db.User.count().then(function(c){

			var ids = service.randomArray(total, c-1);

			service.next = next;

			abe.db.User.findAll({where: {id: { $in: ids }}})
				.then(function(users){
					if(users){
						service.users = users;
						service.create(0); // kick off lunch creation
					}
				})
				.catch(function(err){
					console.log(err.stack);
				});

		});


	},

	'create': function(current){

		var service = this;
		var _user = service.users[current];

		
		var name = crypto.createHash('md5').update(new Date().toString()).digest('hex');

		var object = name + ".jpg";
		var dir = abe.config.env.root + "/.tmp/uploads/" + _user.username + "/lunches/";
		var path = dir + object;
		var url = "/uploads/" + _user.username + "/lunches/" + object;

		var lunch = "http://lorempixel.com/640/640/food/";

		
		if(!abe.config.env.s3){

			if (!fs.existsSync(dir)){
			    fs.mkdir(dir, function(err){
			    	request.get(lunch).pipe(fs.createWriteStream(path));
			    });
			}else{
				request.get(lunch).pipe(fs.createWriteStream(path));
			}

		}else{


			http.get(lunch, function(res){
			  
				var headers = { 
					'Content-Type': res.headers['content-type'], 
					'x-amz-acl': 'public-read'
				};

				upload = new MultiPartUpload({
					client: s3Client,
					objectName: url,
					stream: res,
					headers: headers
				});

				upload.on('error', function(err){
					abe.logs.error(err);
				});

				upload.on('completed', function(res){
					abe.logs.info(res);
				});

			});

			var _lunch, _photo;
		
			abe.db.Photo.create({ original: url })
			.then(function(photo){

				var lunchPhoto = photo;
				
				abe.db.Lunch.create({ region: _user.region, PhotoId: lunchPhoto.id, UserId: _user.id })
					.then(function(lunch){
						current++;
						if(current < service.users.length){
							_lunch = lunch.toJSON();
							_lunch.Photo = lunchPhoto.toJSON();
							service.lunches.push(_lunch);
							service.create(current);
						}else{
							service.complete();
						}
					});

			});

		}


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
		return arr;

	},

	complete: function(){

		var service = this;
		abe.logs.debug("Lunch generation complete");
		service.next(null, service.lunches);
		service.users = [];
		service.lunches = [];

	}
	

};


