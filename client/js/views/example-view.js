'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	nunjucks = require('nunjucks'),
	app = require('helpers/app');

var ExampleView = Backbone.View.extend({

	'el': '#example',

	'events': {},

	'initialize': function () {
		var view = this;

		nunjucks.configure({ autoescape: true });

		view.listenTo(view.collection, 'all', view.render);

		console.log('ExampleView : Initialized');
	},

	'render': function () {
		var view = this;

		view.$el.html('');
		view.collection.each(function (example) {
			var message = nunjucks.render('example.html', example.toJSON());
			view.$el.append(message);
		});
	}
});

module.exports = ExampleView;