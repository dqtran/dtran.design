'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	Example = require('models/example'),
	app = require('helpers/app');

var ExampleCollection = Backbone.Collection.extend({

	'model': Example,

	'initialize': function () {
		console.log('ExampleCollection : Initialized');
	}

});

module.exports = ExampleCollection;