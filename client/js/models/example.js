'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	app = require('helpers/app');

var Example = Backbone.Model.extend({

	'defaults': {
		'message': ''
	},

	'initialize': function() {}

});

module.exports = Example;