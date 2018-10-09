/**
 * Import base packages
 */
const Rcon = require('srcds-rcon');
const config = require("../config");
const log = require("./logger");
const csgoConfig = require("./csgo-config");
const queue = require("./queue");

/**
 * Create global vars
 */
let rcon = {};
let broadcasters = {};

/**
 * Function to init all RCON connections
 */
const init = () => {
    for(let item = 0; item < config.servers.length; item++){
        broadcasters[`${config.servers[item].ip}:${config.servers[item].port}`] = null;
        rcon[`${config.servers[item].ip}:${config.servers[item].port}`] = Rcon({
            address: `${config.servers[item].ip}:${config.servers[item].port}`,
            password: config.servers[item].password
        });

        rcon[`${config.servers[item].ip}:${config.servers[item].port}`].connect().then(() => {
            log.info(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Server ready `);
            // initBroadcaster(`${config.servers[item].ip}:${config.servers[item].port}`); //todo fix in next release
        }).catch(err => {
            log.error(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Failed to connect to rcon: `, err);
        });
    }
};

/**
 * Function to start the message broadcaster on a server
 *
 * @param server
 */
const initBroadcaster = (server) => {
    broadcasters[server] = setInterval(() => {
        queue.add(server, () => {
            rcon[server].command(`say "Welcome to the ${config.application.companyName} server"`).then(() => {
                log.info(`[BROADCASTER][${server}] Message sending complete!`);
                queue.complete(server);
            });
        });
    }, 60000);
};

/**
 * Function to load the CSGO config file in the server
 *
 * @param server
 * @param match_config
 * @param type
 */
const loadExternalCSGOConfig = (server, match_config, type = "main") => {
    csgoConfig.loadCSGOConfig(match_config, type, (config) => {
        for(let item = 0; item < config.length; item++) {
            queue.add(server, () => {
                rcon[server].command(config[item]).then(() => {
                    queue.complete(server);
                });
            });
        }
    });
};

/**
 * Function find the restore config that belongs to the server
 *
 * @param server
 * @return string
 */
const findServerRestoreConfig = (server) => {
    for(let item = 0; item < config.servers.length; item++) {
        const splitted = server.split(":");

        if(config.servers[item].ip === splitted[0] && config.servers[item].port === parseInt(splitted[1])) {
            return config.servers[item].server_restore_config;
        }
    }

    return "server";
};

/**
 * Function to start a match
 *
 * @param server
 * @param matchInfo
 * @param type
 */
const startMatch = (server, matchInfo, type = "main") => {
    const team1 = matchInfo.team1;
    const team2 = matchInfo.team2;
    const match_config = matchInfo.match_config;

    /**
     * Set hostname for match
     */
    queue.add(server, () => {
        rcon[server].command(`hostname "${config.application.companyName}: ${team1.name} vs ${team2.name}"`).then(source => {
            log.trace(`[RCON][${server}] Hostname change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change teamnames
     */
    queue.add(server, () => {
        rcon[server].command(`mp_teamname_1 "${team1.name}"`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, () => {
        rcon[server].command(`mp_teamname_2 "${team2.name}"`).then(source => {
            log.trace(`[RCON][${server}] Teamname 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change team flags
     */
    queue.add(server, () => {
        rcon[server].command(`mp_teamflag_1 "${team1.country}"`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, () => {
        rcon[server].command(`mp_teamflag_2 "${team2.country}"`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load External config file
     */
    loadExternalCSGOConfig(server, match_config, type);

    /**
     * Restart game
     */
    queue.add(server, () => {
        rcon[server].command(`mp_restartgame 1`).then(source => {
            log.trace(`[RCON][${server}] Restart game: `, source);
            log.info(`[RCON][${server}] Match config ready and started!`);
            queue.complete(server);
        });
    });
};

/**
 * Function to reset the server to the default settings
 *
 * @param server
 */
const reset = (server) => {
    /**
     * Set hostname for match
     */
    queue.add(server, () => {
        rcon[server].command(`hostname ""`).then(source => {
            log.trace(`[RCON][${server}] Hostname change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change teamnames
     */
    queue.add(server, () => {
        rcon[server].command(`mp_teamname_1 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, () => {
        rcon[server].command(`mp_teamname_2 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change team flags
     */
    queue.add(server, () => {
        rcon[server].command(`mp_teamflag_1 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, () => {
        rcon[server].command(`mp_teamflag_2 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load default CSGO config
     */
    queue.add(server, () => {
        rcon[server].command('exec gamemode_competitive').then(source => {
            log.trace(`[RCON][${server}] Gamemode update`, source);
            queue.complete(server);
        });
    });

    /**
     * Inform players
     */
    queue.add(server, () => {
        rcon[server].command('say "Resetting game settings to default..."').then(source => {
            log.trace(`[RCON][${server}] Say reset`, source);
            log.info(`[RCON][${server}] Resetting server to default settings and ending match!`);
            queue.complete(server);
        });
    });

    /**
     * Restart game
     */
    queue.add(server, () => {
        rcon[server].command(`mp_restartgame 1`).then(source => {
            log.trace(`[RCON][${server}] Restart game: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load default Server config
     */
    queue.add(server, () => {
        rcon[server].command(`exec ${findServerRestoreConfig(server)}.cfg`).then(source => {
            log.trace(`[RCON][${server}] Load default server config `, source);
            queue.complete(server);
        });
    });
};

/**
 * Sends a single command to the rcon server
 *
 * @param server
 * @param cmd
 */
const cmd = (server, cmd) => {
    queue.add(server, () => {
        rcon[server].command(cmd).then(source => {
            log.trace(`[RCON][${server}] CMD Send: `, source);
            queue.complete(server);
        });
    });
};

/**
 * Start connecting to all RCON servers
 */
init();

module.exports = {startMatch, initBroadcaster, reset, cmd};
