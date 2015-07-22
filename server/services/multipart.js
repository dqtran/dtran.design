var multiparty = require('multiparty');
var fs = require('fs');
var MultiPartUpload = require('knox-mpu');
var knox = require('knox');
var crypto = require('crypto');
var path = require('path');

var bucket, 
	s3Client, 
	upload = null;

if(abe.config.env.s3){
	bucket = abe.config.env.s3.bucket;
	// DOCS: // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property

	s3Client = knox.createClient({
	    key: abe.config.env.s3.key,
	  	secret: abe.config.env.s3.secret,
	  	bucket: abe.config.env.s3.bucket
	});

}


module.exports = {

	options: {
		encoding: 'utf8',
		maxFilesSize: 10 * (1024*1000) // MB
	},

	parse: function(filePath, req, res, next){

		console.log('s3: ' + abe.config.env.s3);

		if(!abe.config.env.s3){
			this.local(filePath, req, res, next);
		}else{
			this.s3(filePath, req, res, next);
		}
		
	},

	local: function(filePath, req, res, next){

		if (!fs.existsSync(this.options.uploadDir)){
			abe.logs.info('created dir: ' + this.options.uploadDir);
		    fs.mkdirSync(this.options.uploadDir);
		}

		this.options.uploadDir = abe.config.env.root + '/.tmp/uploads/' + filePath;

		var form = new multiparty.Form(this.options);
		delete this.options.uploadDir;

		form.on('error', function(err) {
		  return next(err);
		});

		form.parse(req, function(err, fields, files){

			if(err) return next(err);
			abe.logs.debug('Received ' + files.length + ' files');
			req.fields = fields;
			req.files = files;
			return next(null, req);

		});
	},

	s3: function(filePath, req, res, next){

		var form = new multiparty.Form(this.options),
			files = {},
			fields = {},
			hasFiles = false;

		form.on('error', function(err) {
		  return next(err);
		});



		form.on('field', function(name, value) {
	      
			fields[name] = [];
			fields[name][0] = value;

	    });

		form.on('part', function(part){

			if(part.filename !== null){

				hasFiles = true;
				var name = crypto.createHash('md5').update(new Date().toString()).digest('hex');
				var ext = path.extname(part.filename);
				var s3Path = 'uploads/' + filePath + '/' + name + ext;

			    files[part.name] = [];
			    files[part.name][0] = {};
			    files[part.name][0].path = s3Path;


			    var headers = { 
					'Content-Type': part.headers['content-type'], 
					'x-amz-acl': 'public-read'
				};

				upload = new MultiPartUpload({
					client: s3Client,
					objectName: s3Path,
					stream: part,
					headers: headers
				});

				upload.on('error', function(err){
					abe.logs.error(err);
					return next(err);
				});

				upload.on('completed', function(res){
					abe.logs.info(res);
					next(null, req);
			        console.log("done", res);
			        console.log("https://s3.amazonaws.com/" + bucket + '/' + s3Path);
				});

			}

		});


		form.on('close', function(){
			req.fields = fields;
			req.files = files;
			if(!hasFiles) next(null, req);  // only resond it no files were found
		});

		form.parse(req);
	}


};