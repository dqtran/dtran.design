/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/* global abe */
var newrelic;

if(process.env.NODE_ENV){
	newrelic = require('newrelic');
}

var requireDir = require('require-dir');
var glob = require('glob');

// INFO: globals
_ = require('lodash');
abe = {}; //setup global abe varible

abe.config = requireDir('../config');
abe.logs = abe.config.logger(abe.config.env.logs.level);


// INFO: initial application models, services and policies
abe.db = require('./models');
abe.services = requireDir('./services');
abe.jobs = require('./jobs');

abe.db.sequelize
	.sync()
	.then(function () {
		
		abe.start();		

	}).catch(function (e) {
		throw new Error(e);
	});

abe.logs.debug("");
abe.logs.debug("");
abe.logs.debug('Worker has started.');

abe.start = function(){

	// var oneMinute = (1000 * 60);
	// // var oneMinute = 1000;

	// var voter = setInterval(abe.jobs.bootstrap.vote, oneMinute * 1);
	// var national = setInterval(abe.jobs.bootstrap.national, oneMinute * 1);
	// var cleancut = setInterval(abe.jobs.bootstrap.lunch, oneMinute * 5);


};

module.exports = abe;
