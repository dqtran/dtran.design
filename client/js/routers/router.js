'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	app = require('helpers/app');

var Router = Backbone.Router.extend({

	'routes': {
		'example/:message': 'example'
	},

	'initialize': function () {
		console.log('Router : Initialized');
	},

	'example': function (message) {
		app.collections.examples.add({ 'message': message });

		// example of custom event
		app.trigger('router:holla');
	}
});

module.exports = Router;