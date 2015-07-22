var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    baseURL: '//dtran-design.herokuapp.com/',
    app: {
      name: 'dtran-design'
    },
    db: {
        uri: process.env.DATABASE_URL,
        options: {
            pool: {
                max: 5,
                min: 0,
                idle: 10000
              },
            // logging: abe.logs.debug,
            logging: false,
            sync: {
                force: false, // WARN setting this to true drops all tables (see: http://sequelize.readthedocs.org/en/latest/api/sequelize/#syncoptions-promise)
            }
        }
    },
    logs: {
        level: 'debug',
        // sql: abe.logs.debug,
        format: ':method :url :status :response-time ms - :res[content-length]'
    },
    s3: {
        bucket: process.env.S3_BUCKET,
        key: process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        url: process.env.S3_URL
    }
};