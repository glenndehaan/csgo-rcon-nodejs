/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import base packages
 */
const config = require("../config");
const log = require('simple-node-logger').createSimpleLogger({
    logFilePath: `${dev ? __dirname + '/../' : process.cwd()}${config.logger.location}`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

/**
 * Set log level from config
 */
log.setLevel(config.application.logLevel);

module.exports = log;
