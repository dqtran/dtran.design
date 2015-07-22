'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	Router = require('routers/router'),
	app = require('helpers/app');

window.$ = $;
window.jQuery = $;

Backbone.$ = $;


// example of custom event binding
app.on('router:holla', function () {
	console.log('holla back!');
});

var router = new Router();

Backbone.history.start();