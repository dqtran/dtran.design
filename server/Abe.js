/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/* global abe */
var newrelic;

if(process.env.NODE_ENV){
	newrelic = require('newrelic');
}

var express = require('express');
var app = express();

var requireDir = require('require-dir');
var glob = require('glob');

// INFO: globals
_ = require('lodash');
abe = app; //setup global abe varible


module.exports = function(){

	abe.config = requireDir('../config');
	abe.logs = abe.config.logger(abe.config.env.logs.level);


	// INFO: initial application models, services and policies
	abe.db = require('./models');
	abe.services = requireDir('./services');
	abe.policies = requireDir('./policies');

	abe.services.passport.loadStrategies();


	// INFO: add custom responese to the response object
	abe.responses = requireDir('./responses');
	_.extend(express.response, abe.responses);

	// INFO: adds controllers to the global object
	var baseControllers = glob.sync(app.config.env.root + '/server/controllers/*.js');
	var v0Controllers = glob.sync(app.config.env.root + '/server/controllers/v0/*.js');

	abe.controllers = require(abe.config.env.root + '/config/controllers')(baseControllers);
	abe.controllers.v0 = require(abe.config.env.root + '/config/controllers')(v0Controllers);


	// INFO: create server w/ middle ware and 
	require(abe.config.env.root + '/config/express')(abe);

	abe.db.sequelize
		.sync()
		.then(function () {

			abe.set('port', (process.env.PORT || 4832));
			abe.listen(abe.get('port'));

			abe.logs.debug("");
			abe.logs.debug("");
			abe.logs.debug('See website at: http://localhost:' + abe.get('port'));

			// bootstrap data
			// abe.services.bootstrap.generate('users', 100);
			// abe.services.bootstrap.generate('lunches', 40);
			// abe.services.bootstrap.generate('votes', 100);

		}).catch(function (e) {
			throw new Error(e);
		});

	


	

};