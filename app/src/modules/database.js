/**
 * Import base packages
 */
const JsonDB = require('node-json-db');
const log = require("./logger");

class database {
    /**
     * Constructor
     */
    constructor() {
        this.db = new JsonDB('csgo-rcon', true, false);
    }

    /**
     * Initial function
     */
    init() {
        /**
         * Init the DB object if we launch the app for the first time
         */
        if(Object.keys(this.db.getData("/")).length === 0 && this.db.getData("/").constructor === Object){
            this.db.push("/match", []);

            log.info("[DATABASE] Initialize database for the first time!");
        }

        log.info("[DATABASE] Ready!");
    }
}

module.exports = new database();
