var Promise = require('bluebird');

module.exports = {

    'index': function(req, res, next){
    	res.view('dashboard/index', {
      		title: 'dtran-design',
    	});
    },

    'edit': function(req, res, next){
    	res.view('dashboard/edit', {
    		title: 'dtran-design'
    	})
    },

    'update': function(req, res, next){
    },    
};
