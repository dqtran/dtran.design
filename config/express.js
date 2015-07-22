
var express = require('express');
var glob = require('glob');
var path = require('path');
var uuid = require('node-uuid');
var morgan = require('morgan');

var url = require('url');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var RedisStore, redisClient;

var nunjucks = require('nunjucks');

var csrf = require('csurf');

module.exports = function(app) {
	// configure views engine
	nunjucks.configure(app.config.env.root + '/views', {
		express: app
	});

	app.set('view engine', 'html');
	app.engine('html', nunjucks.render);

 	var env = process.env.NODE_ENV || 'local';
 	app.locals.ENV = env;

 	morgan.token('id', function getId(req) {
	  return req.id;
	});

 	// TODO: potentially work this out later
 	app.middleware = {};
	app.middleware.csrfProtection = csrf({ cookie: true });


	app.use(express.static(app.config.env.root + '/.tmp/public'));
	app.use('/uploads', express.static(app.config.env.root + '/.tmp/uploads'));
	
 	app.use(favicon(path.join(app.config.env.root, '/.tmp', 'public', 'images', 'favicon.ico')));

 	app.use(assignId);
 	
	app.use(morgan(app.config.env.logs.format, {
		skip: function (req, res) { return res.statusCode < 400 } // only log errors
	}));
	

 	app.use(bodyParser.json());
 	app.use(bodyParser.urlencoded({
 	  extended: true
 	}));
 	app.use(cookieParser());

 	// INFO: creating the session store
 	if(app.config.session.store.options.uri){

 		var options = {};
 		var uri = url.parse(app.config.session.store.options.uri);

 		if(uri.protocol) options.adapter = uri.protocol;
 		if(uri.hostname) options.host = uri.hostname;
 		if(uri.port) options.port = uri.port;
 		if(uri.auth){
 			var arr = uri.auth.split(':');
 			if(arr[0]) options.user = arr[0];
 			if(arr[1]) options.pass = arr[1];
 		}
 		RedisStore = require('connect-redis')(session);
 		redisClient = new RedisStore(options);

 	}


 	app.config.session.config.store = redisClient;


 	app.use(session(app.config.session.config));
  	app.use(flash());
 	app.use(compress());
 	app.use(methodOverride());
 	

 	redisClient.get('', function (err, res) {
	    if (err) {
	      // USE IN MEMORY STORE
	      abe.logs.error('REDIS NOT RUNNING');
	    } else {
	       abe.logs.info('REDIS RUNNING');
	    }
	});


 	var routers = glob.sync(app.config.env.root + '/server/routes/**/*.js');
 	routers.forEach(function (route) {
 	 	require(route)(app, express);
 	});

 	
 	if(app.get('env') !== 'production'){


 		app.use(function(err, req, res, next){
 			
 			if(err.stack){
 				abe.logs.debug(err.stack);
 			}else{
 				abe.logs.debug(err);
 			}

 			next(err, req, res, next);
 		});


 		app.use(function (err, req, res, next) {
 			res.status(err.status || 500);

 			// TODO: add flash messages, forms and handle resdirects 

 			// INFO: looking to model the twitter responses: 
 			// https://dev.twitter.com/overview/api/response-codes

 			var message = err.message;
 			var data = {
 				message: message,
 				code: err.code
 			};

 			res.view('error', data);

 		});

 	}

 	app.use(function (req, res, next) {
 	  var err = new Error('Not Found');
 	  err.status = 404;
 	  next(err);
 	});

 	app.use(function (err, req, res, next) {

 	  res.status(err.status || 500);
 	    res.view('error', {
 	      message: err.message,
 	      error: {},
 	    });

 	});

};



function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}
