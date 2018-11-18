const log = require("./logger");
const config = require("../config");

class queue {
    /**
     * Constructor
     */
    constructor() {
        this.queueFailMax = 35;
        this.activeQueue = {};
        this.commandRunning = {};
        this.queueFailCurrent = {};

        this.init();
    }

    /**
     * Init function to add the servers to the global objects
     */
    init() {
        for (let item = 0; item < config.servers.length; item++) {
            this.activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`] = [];
            this.commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] = false;
            this.queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] = 0;
        }

        /**
         * Loop over the commands and execute them when possible
         */
        setInterval(() => {
            for (let item = 0; item < config.servers.length; item++) {
                if (this.activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`].length > 0) {
                    if (!this.commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] || this.queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] === this.queueFailMax) {
                        this.commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] = true;

                        this.activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`][0]();
                        this.activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`].splice(0, 1);

                        if (this.queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] === this.queueFailMax) {
                            this.queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] = 0;
                            this.complete(`${config.servers[item].ip}:${config.servers[item].port}`);

                            log.warn(`[QUEUE][${config.servers[item].ip}:${config.servers[item].port}] Max Queue Fail reached! Cleaning up...`);
                        }
                    } else {
                        this.queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`]++;
                    }
                }
            }
        }, 10);
    }

    /**
     * Function to add a command to the queue
     *
     * @param server string
     * @param command Function
     */
    add(server, command) {
        this.activeQueue[server].push(command);
    }

    /**
     * Function that must be run when a command is done
     *
     * @param server
     */
    complete(server) {
        this.commandRunning[server] = false;
    }
}

module.exports = new queue();
