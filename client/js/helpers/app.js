'use strict';

var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		app;

function App() {
	var $config = $('#app-config'),
			data = $config.length && $config.text() ? $.parseJSON($.trim($config.text())) : {};

	this.collections = {};
	this.views = {};

	// Extend with config data and events
	_.extend(this, data, Backbone.Events);
}

module.exports = function () {
	if (!app) app = new App();
	return app;
}();