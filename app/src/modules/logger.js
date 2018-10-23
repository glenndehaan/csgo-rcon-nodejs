/**
 * Import base packages
 */
const fs = require('fs');
const config = require("../config");

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Create log dir if it doesn't exists
 */
if (!fs.existsSync(`${dev ? __dirname + '/../' : process.cwd() + '/'}${config.logger.location}`)){
    fs.mkdirSync(`${dev ? __dirname + '/../' : process.cwd() + '/'}${config.logger.location}`);
}

/**
 * Setup logger
 */
const log = require('simple-node-logger').createSimpleLogger({
    logFilePath: `${dev ? __dirname + '/../' : process.cwd() + '/'}${config.logger.location}/server.log`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

/**
 * Set log level from config
 */
log.setLevel(config.logger.level);

module.exports = log;
