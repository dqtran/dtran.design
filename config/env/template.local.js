var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {
    root: rootPath,
    app: {
      name: 'abe-boilerplate'
    },
    port: 3000,
    db: {
        uri: 'postgres://localhost/abe-boilerplate-development',
        force: true // WARN setting this to true drops all tables (see: http://sequelize.readthedocs.org/en/latest/api/sequelize/#syncoptions-promise)
    },
    logs: {
    	level: 'debug',
    	// sql: abe.logs.debug,
        sql: false,
        format: ':method :url - (:response-time ms)'
    }
};