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
 * Function to start the message broadcaster on a server
 *
 * @param server
 */
function initBroadcaster(server) {
    broadcasters[server] = setInterval(() => {
        queue.add(server, function() {
            rcon[server].command(`say "Welcome to the ${config.application.companyName} server"`).then(() => {
                log.info(`[BROADCASTER][${server}] Message sending complete!`);
                queue.complete(server);
            });
        });
    }, 60000);
}

/**
 * Function to load the CSGO config in the server
 *
 * @param server
 * @param match_config
 */
function loadCSGOConfig(server, match_config) {
    csgoConfig.loadCSGOConfig(match_config, "main", (config) => {
        for(let item = 0; item < config.length; item++) {
            queue.add(server, function() {
                rcon[server].command(config[item]).then(() => {
                    queue.complete(server);
                });
            });
        }
    });
}

/**
 * Function find the restore config that belongs to the server
 *
 * @param server
 * @return string
 */
function findServerRestoreConfig(server) {
    for(let item = 0; item < config.servers.length; item++) {
        const splitted = server.split(":");

        if(config.servers[item].ip === splitted[0] && config.servers[item].port === parseInt(splitted[1])) {
            return config.servers[item].server_restore_config;
        }
    }

    return "server";
}

/**
 * Function to start a basic match
 *
 * @param server
 * @param matchInfo
 */
function startMatch(server, matchInfo) {
    const team1 = matchInfo.team1;
    const team2 = matchInfo.team2;

    // const map = matchInfo.map;
    const match_config = matchInfo.match_config;

    /**
     * Set hostname for match
     */
    queue.add(server, function() {
        rcon[server].command(`hostname "${config.application.companyName}: ${team1.name} vs ${team2.name}"`).then(source => {
            log.trace(`[RCON][${server}] Hostname change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change teamnames
     */
    queue.add(server, function() {
        rcon[server].command(`mp_teamname_1 "${team1.name}"`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, function() {
        rcon[server].command(`mp_teamname_2 "${team2.name}"`).then(source => {
            log.trace(`[RCON][${server}] Teamname 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change team flags
     */
    queue.add(server, function() {
        rcon[server].command(`mp_teamflag_1 "${team1.country}"`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, function() {
        rcon[server].command(`mp_teamflag_2 "${team2.country}"`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load ESL5V5 config
     */
    loadCSGOConfig(server, match_config);

    /**
     * Change map
     * todo not working!
     */
    // queue.add(server, function() {
    //     rcon[server].command(`map ${map}`).then(source => {
    //         log.trace(`[RCON][${server}] Map change: `, source);
    //         queue.complete(server);
    //     });
    // });

    /**
     * Restart game
     */
    queue.add(server, function() {
        rcon[server].command(`mp_restartgame 1`).then(source => {
            log.trace(`[RCON][${server}] Restart game: `, source);
            log.info(`[RCON][${server}] Match config ready and started!`);
            queue.complete(server);
        });
    });
}

/**
 * Function to init all RCON connections
 *
 * @param server
 * @param matchInfo
 * @param autoStartMatch
 */
function connect(server, matchInfo = {}, autoStartMatch = false) {
    for(let item = 0; item < config.servers.length; item++){
        if(`${config.servers[item].ip}:${config.servers[item].port}` === server) {
            console.log('server');
            if(autoStartMatch) {
                broadcasters[`${config.servers[item].ip}:${config.servers[item].port}`] = null;
            }

            rcon[`${config.servers[item].ip}:${config.servers[item].port}`] = Rcon({
                address: `${config.servers[item].ip}:${config.servers[item].port}`,
                password: config.servers[item].password
            });

            rcon[`${config.servers[item].ip}:${config.servers[item].port}`].connect().then(() => {
                log.info(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Server ready `);

                if(autoStartMatch) {
                    initBroadcaster(`${config.servers[item].ip}:${config.servers[item].port}`);
                    startMatch(`${config.servers[item].ip}:${config.servers[item].port}`, matchInfo);
                }
            }).catch(err => {
                log.error(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Failed to connect to rcon: `, err);
            });

            break;
        }
    }
}

/**
 * Function to reset the server to the default settings
 *
 * @param server
 */
function reset(server) {
    /**
     * Set hostname for match
     */
    queue.add(server, function() {
        rcon[server].command(`hostname ""`).then(source => {
            log.trace(`[RCON][${server}] Hostname change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change teamnames
     */
    queue.add(server, function() {
        rcon[server].command(`mp_teamname_1 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, function() {
        rcon[server].command(`mp_teamname_2 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Change team flags
     */
    queue.add(server, function() {
        rcon[server].command(`mp_teamflag_1 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamname 1 change: `, source);
            queue.complete(server);
        });
    });
    queue.add(server, function() {
        rcon[server].command(`mp_teamflag_2 ""`).then(source => {
            log.trace(`[RCON][${server}] Teamflag 2 change: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load default CSGO config
     */
    queue.add(server, function() {
        rcon[server].command('exec gamemode_competitive').then(source => {
            log.trace(`[RCON][${server}] Gamemode update`, source);
            queue.complete(server);
        });
    });

    /**
     * Inform players
     */
    queue.add(server, function() {
        rcon[server].command('say "Resetting game settings to default..."').then(source => {
            log.trace(`[RCON][${server}] Say reset`, source);
            log.info(`[RCON][${server}] Resetting server to default settings and ending match!`);
            queue.complete(server);
        });
    });

    /**
     * Restart game
     */
    queue.add(server, function() {
        rcon[server].command(`mp_restartgame 1`).then(source => {
            log.trace(`[RCON][${server}] Restart game: `, source);
            queue.complete(server);
        });
    });

    /**
     * Load default Server config
     */
    queue.add(server, function() {
        rcon[server].command(`exec ${findServerRestoreConfig(server)}.cfg`).then(source => {
            log.trace(`[RCON][${server}] Load default server config `, source);
            queue.complete(server);
        });
    });
}

/**
 * Cleanup the server connection (must be runned before starting new match)
 *
 * @param server
 */
function disconnect(server) {
    clearInterval(broadcasters[server]);
    rcon[server].disconnect();
    log.info(`[RCON][${server}] Disconnecting server!`);
}

/**
 * Sends a single command to the rcon server
 *
 * @param server
 * @param cmd
 */
function cmd(server, cmd) {
    queue.add(server, function() {
        rcon[server].command(cmd).then(source => {
            log.trace(`[RCON][${server}] CMD Send: `, source);
            queue.complete(server);
        });
    });
}

module.exports = {connect, reset, disconnect, cmd};
