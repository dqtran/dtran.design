var winston = require('winston');

module.exports = function(level){
    winston.emitErrs = true;

    // TODO: add email transport

    var logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: level,
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });

    return logger;
};

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
