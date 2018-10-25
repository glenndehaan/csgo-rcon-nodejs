/**
 * Import own modules
 */
const config = require("./config");
const log = require("./modules/logger");
const database = require("./modules/database");
const queue = require("./modules/queue");
const web = require("./modules/web");
const challonge = require("./modules/challonge");

/**
 * Hack since the srcds-rcon package isn't handling rejections
 */
process.on('unhandledRejection', () => {});

/**
 * Init modules
 */
database.init();
queue.init();
web.init();
if(config.integrations.challonge.enabled) {
    challonge.init();
}

log.info("[SYSTEM] App running");
