'use strict';

(function(){
	var abe;

	try{
		abe = require('./server');
	}catch (e){
		console.error(e);
		throw e;
	    return;
	}

	var rc;
	try {
	  	rc = require('rc');
	} catch (e) {
	 	console.error('Could not find dependency: `rc`.');
 		console.error('Your `.aberc` file(s) will be ignored.');
 		console.error('To resolve this, run:');
 		console.error('npm install rc --save');
 		rc = function () { return {}; };
	}


})();