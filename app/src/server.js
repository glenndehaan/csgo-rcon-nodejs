/**
 * Import own modules
 */
const version = require("./config/version");
const config = require("./config");
const log = require("./modules/logger");
const database = require("./modules/database");
const csgoConfig = require("./modules/csgoConfig");
const queue = require("./modules/queue");
const web = require("./modules/web");
const challonge = require("./modules/challonge");

/**
 * Hack since the srcds-rcon package isn't handling rejections
 */
process.on('unhandledRejection', () => {});

/**
 * Check if we are running as dev
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Init modules
 */
if(!dev) {
    csgoConfig.init();
}
database.init();
queue.init();
web.init();
if(config.integrations.challonge.enabled) {
    challonge.init();
}

log.info("[SYSTEM] App running");
log.info(`[SYSTEM] Version: ${version}`);
