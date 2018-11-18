/**
 * Import external modules
 */
const fs = require("fs");

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

log.info("[SYSTEM] App running");
log.info(`[SYSTEM] Version: ${version}`);
log.info(`[SYSTEM] Support and Help: https://github.com/glenndehaan/csgo-rcon-nodejs`);

/**
 * Check if this is the first time running the app
 */
if(!dev) {
    if (!fs.existsSync(`${process.cwd()}/LICENCE`) || !fs.existsSync(`${process.cwd()}/README.md`)) {
        fs.writeFileSync(process.cwd() + '/LICENCE', fs.readFileSync(__dirname + '/../../LICENCE', 'utf8'));
        fs.writeFileSync(process.cwd() + '/README.md', fs.readFileSync(__dirname + '/../../README.md', 'utf8'));

        log.info("------------------------------------------");
        log.info("Hi and thank you for using this piece of software!");
        log.info("Go ahead and update the config.json to your needed then relaunch the software!");
        log.info("The software will close in 5 seconds!");
        log.info("------------------------------------------");

        setTimeout(() => {
            process.exit(0);
        }, 5000)
    } else {
        queue.init();
        web.init();
        if(config.integrations.challonge.enabled) {
            challonge.init();
        }
    }
} else {
    queue.init();
    web.init();
    if(config.integrations.challonge.enabled) {
        challonge.init();
    }
}
