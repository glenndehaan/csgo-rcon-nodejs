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
 * Create callback storage for socket
 */
const callbacks = [];

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

/**
 * Fix zero prefixing
 *
 * @param number
 * @return {*}
 */
const fixTimeDateCalculation = (number) => {
    if (number <= 9) {
        return `0${number}`;
    }

    return number;
};

/**
 * Fix zero prefixing
 *
 * @param number
 * @return {*}
 */
const fixMilisecondsCalculation = (number) => {
    if (number <= 9) {
        return `00${number}`;
    }

    if (number <= 99) {
        return `0${number}`;
    }

    return number;
};

/**
 * Return the current time/date string
 *
 * @return {string}
 */
const currentDateTime = () => {
    const current = new Date();
    const date = `${current.getFullYear()}-${fixTimeDateCalculation(current.getMonth() + 1)}-${fixTimeDateCalculation(current.getDate())}`;
    const time = `${fixTimeDateCalculation(current.getHours())}:${fixTimeDateCalculation(current.getMinutes())}:${fixTimeDateCalculation(current.getSeconds())}.${fixMilisecondsCalculation(current.getMilliseconds())}`;

    return `${date} ${time}`;
};

/**
 * Add a callback to the callback storage
 *
 * @param callback
 */
const addCallback = (callback) => {
    callbacks.push(callback);
};

/**
 * Trace provider
 */
const trace = (message) => {
    log.trace(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} TRACE ${message}`);
    }
};

/**
 * Debug provider
 */
const debug = (message) => {
    log.debug(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} DEBUG ${message}`);
    }
};

/**
 * Debug provider
 */
const info = (message) => {
    log.info(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} INFO  ${message}`);
    }
};

/**
 * Warn provider
 */
const warn = (message) => {
    log.warn(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} WARN  ${message}`);
    }
};

/**
 * Error provider
 */
const error = (message) => {
    log.error(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} ERROR ${message}`);
    }
};

/**
 * Fatal provider
 */
const fatal = (message) => {
    log.fatal(message);

    for(let item = 0; item < callbacks.length; item++) {
        callbacks[item](`${currentDateTime()} FATAL ${message}`);
    }
};

module.exports = {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
    addCallback
};
