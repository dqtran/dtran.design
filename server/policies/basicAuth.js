var basicAuth = require('basic-auth-connect');

module.exports = function(req, res, next){
	next();
};

if(process.env.NODE_ENV){
	console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
	if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging'){
		module.exports = basicAuth('dtran-design', 'manUTD07^^');
	}
}