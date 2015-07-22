if (!process.env.NODE_ENV) {
	// Setup local environment variables
	process.env.NODE_ENV = 'local';
}

var env = require('./env/' + process.env.NODE_ENV);

module.exports = env;
