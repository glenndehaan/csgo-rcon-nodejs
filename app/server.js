/**
 * Import own modules
 */
const log = require("./modules/logger");
const database = require("./modules/database");
const queue = require("./modules/queue");
const web = require("./modules/web");
const socket = require("./modules/socket");

/**
 * Hack since the srcds-rcon package isn't handling rejections
 */
process.on('unhandledRejection', (reason, p) => {});

/**
 * Init modules
 */
database.init();
queue.init();
web.init();
socket.init();

log.info("[SYSTEM] App running");
