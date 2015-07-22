'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	d3 = require('d3'),
	Backbone = require('backbone'),
	nunjucks = require('nunjucks'),
	app = require('helpers/app');

var D3ChartBase = Backbone.View.extend({

	'el': '.d3-chart',
	'events': {},
	'defaults': {
		margin: { top: 20, right: 20, bottom: 30, left: 40 }
	},

	'initialize': function () {
		var view = this;

		console.log('D3ChartBase : Initialized');
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

module.exports = D3ChartBase;