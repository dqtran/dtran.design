module.exports = function(view, locals, status){

	var res = this;

	if(!status || status === null) status = 200;

	if(!locals || locals === null) locals = {};

	res.format({
	  'text/html': function(){
		res.render(view, locals);
	  },

	  'application/json': function(){
	    res.json(locals);
	  },

	  'default': function() {
	    // log the request and respond with 406
	    res.render(view, locals);
	  }
	});


};