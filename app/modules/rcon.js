/**
 * Import base packages
 */
const Rcon = require('srcds-rcon');
const config = require("../config");
const log = require("./logger");
const csgoConfig = require("./csgo-config");
const queue = require("./queue");
const {splitByByteLength} = require("../utils/Strings");

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

            if(config.broadcaster.enabled) {
                initBroadcaster(`${config.servers[item].ip}:${config.servers[item].port}`);
            }
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
    let currentMessage = 0;
    if(config.broadcaster.messages.length > 0) {
        broadcasters[server] = setInterval(() => {
            cmd(server, `say "${config.broadcaster.messages[currentMessage]}"`, 'Message sending complete');
            currentMessage++;

            if((currentMessage + 1) > config.broadcaster.messages.length) {
                currentMessage = 0;
            }
        }, (config.broadcaster.speed * 1000));
    }
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
        const exported_lines = splitByByteLength(config, 512, '; ');

        for(let item = 0; item < exported_lines.length; item++) {
            log.trace(`[RCON] Config Line: ${JSON.stringify(exported_lines[item])}`);
            cmd(server, exported_lines[item]);
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
    const match_config = (type === "main") ? matchInfo.match_config : matchInfo.knife_config;
    const message = (type === "main") ? "Live!!!" : "Knife!!!";

    /**
     * Load External config file
     */
    loadExternalCSGOConfig(server, match_config, type);

    /**
     * Set hostname for match
     */
    cmd(server, `hostname "${config.application.companyName}: ${team1.name} vs ${team2.name}"`, 'Hostname change');

    /**
     * Change teamnames
     */
    cmd(server, `mp_teamname_1 "${team1.name}"`, 'Teamname 1 change');
    cmd(server, `mp_teamname_2 "${team2.name}"`, 'Teamname 2 change');

    /**
     * Change team flags
     */
    cmd(server, `mp_teamflag_1 "${team1.country}"`, 'Teamflag 1 change');
    cmd(server, `mp_teamflag_2 "${team2.country}"`, 'Teamflag 2 change');

    /**
     * Restart game
     */
    cmd(server, 'mp_restartgame 1', 'Restart game');

    /**
     * Inform players
     */
    cmd(server, `say '${message}'`, 'Say');
    cmd(server, `say '${message}'`, 'Say');
    cmd(server, `say '${message}'`, 'Say');

    log.info(`[RCON][${server}] Match config ready and started!`);
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
    cmd(server, 'hostname ""', 'Hostname change');

    /**
     * Change teamnames
     */
    cmd(server, 'mp_teamname_1 ""', 'Teamname 1 change');
    cmd(server, 'mp_teamname_2 ""', 'Teamname 2 change');

    /**
     * Change team flags
     */
    cmd(server, 'mp_teamflag_1 ""', 'Teamflag 1 change');
    cmd(server, 'mp_teamflag_2 ""', 'Teamflag 2 change');

    /**
     * Load default CSGO config
     */
    cmd(server, 'exec gamemode_competitive', 'Gamemode update');

    /**
     * Inform players
     */
    cmd(server, 'say "Resetting game settings to default..."', 'Resetting server to default settings and ending match!');

    /**
     * Restart game
     */
    cmd(server, 'mp_restartgame 1', 'Restart game');

    /**
     * Load default Server config
     */
    const restoreConfig = findServerRestoreConfig(server);
    if(restoreConfig !== false) {
        cmd(server, `exec ${findServerRestoreConfig(server)}.cfg`, 'Load default server config');
    }

    log.info(`[RCON][${server}] Has been reset to the default configuration!`);
};

/**
 * Sends a single command to the rcon server
 *
 * @param server
 * @param cmd
 * @param message
 */
const cmd = (server, cmd, message = "CMD Send") => {
    queue.add(server, () => {
        rcon[server].command(cmd).then(source => {
            log.trace(`[RCON][${server}] ${message}: `, source);
            queue.complete(server);
        });
    });
};

/**
 * Start connecting to all RCON servers
 */
init();

module.exports = {startMatch, reset, cmd};
