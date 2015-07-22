'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	nunjucks = require('nunjucks'),
	app = require('helpers/app');

var DashboardView = Backbone.View.extend({

	'el': '.dashboard',

	'events': {},

	'initialize': function () {
		var view = this;

		nunjucks.configure({ autoescape: true });

		view.listenTo(view.collection, 'all', view.render);
		view.collection.fetch();

		console.log('DashboardView : Initialized');
	},

	'render': function () {
		var view = this;

		view.$el.find('.lunches').html('');
		view.collection.each(function (model) {
			var lunch = nunjucks.render('lunch.html', model.toJSON());
			view.$el.find('.lunches').append(lunch);
		});

		console.log('DashboardView : Render');
	}
});

module.exports = DashboardView;