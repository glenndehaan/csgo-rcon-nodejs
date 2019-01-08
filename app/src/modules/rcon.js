/**
 * Import base packages
 */
const Rcon = require('srcds-rcon');
const config = require("../config");
const log = require("./logger");
const csgoConfig = require("./csgoConfig");
const queue = require("./queue");
const {splitByByteLength} = require("../utils/Strings");

class rcon {
    /**
     * Constructor
     */
    constructor() {
        this.rcon = {};
        this.broadcasters = {};
        this.pluginAvailable = {};

        this.init();
    }

    /**
     * Function to init all RCON connections
     */
    init() {
        for(let item = 0; item < config.servers.length; item++){
            this.broadcasters[`${config.servers[item].ip}:${config.servers[item].port}`] = null;
            this.rcon[`${config.servers[item].ip}:${config.servers[item].port}`] = Rcon({
                address: `${config.servers[item].ip}:${config.servers[item].port}`,
                password: config.servers[item].password
            });

            this.rcon[`${config.servers[item].ip}:${config.servers[item].port}`].connect().then(() => {
                log.info(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Server ready `);
                this.checkPlugin(`${config.servers[item].ip}:${config.servers[item].port}`);

                if(config.broadcaster.enabled) {
                    this.initBroadcaster(`${config.servers[item].ip}:${config.servers[item].port}`);
                }
            }).catch(err => {
                log.error(`[RCON INIT][${config.servers[item].ip}:${config.servers[item].port}] Failed to connect to rcon: `, err);
            });
        }
    }

    /**
     * Function to start the message broadcaster on a server
     *
     * @param server
     */
    initBroadcaster(server) {
        let currentMessage = 0;

        if(config.broadcaster.messages.length > 0) {
            this.broadcasters[server] = setInterval(() => {
                this.cmd(server, `say "${config.broadcaster.messages[currentMessage]}"`, 'Message sending complete');
                currentMessage++;

                if((currentMessage + 1) > config.broadcaster.messages.length) {
                    currentMessage = 0;
                }
            }, (config.broadcaster.speed * 1000));
        }
    }

    /**
     * Function to load the CSGO config file in the server
     *
     * @param server
     * @param match_config
     * @param type
     */
    loadExternalCSGOConfig(server, match_config, type = "main") {
        csgoConfig.load(match_config, type, (config) => {
            const exported_lines = splitByByteLength(config, 512, '; ');

            for(let item = 0; item < exported_lines.length; item++) {
                log.trace(`[RCON] Config Line: ${JSON.stringify(exported_lines[item])}`);
                this.cmd(server, exported_lines[item]);
            }
        });
    }

    /**
     * Function find the restore config that belongs to the server
     *
     * @param server
     * @return string
     */
    findServerRestoreConfig(server) {
        for(let item = 0; item < config.servers.length; item++) {
            const splitted = server.split(":");

            if(config.servers[item].ip === splitted[0] && config.servers[item].port === parseInt(splitted[1])) {
                return config.servers[item].server_restore_config;
            }
        }

        return "server";
    }

    /**
     * Prepares the server before a match starts
     *
     * @param server
     * @param matchInfo
     */
    prepareServer(server, matchInfo) {
        const team1 = matchInfo.team1;
        const team2 = matchInfo.team2;

        /**
         * Set hostname for match
         */
        this.cmd(server, `hostname "${config.application.companyName}: ${team1.name} vs ${team2.name}"`, 'Hostname change');

        /**
         * Change teamnames
         */
        this.cmd(server, `mp_teamname_1 "${team1.name}"`, 'Teamname 1 change');
        this.cmd(server, `mp_teamname_2 "${team2.name}"`, 'Teamname 2 change');

        if(this.pluginAvailable[server]) {
            this.cmd(server, `sm_teamname_ct "${team1.name}"`, 'Teamname 1 change');
            this.cmd(server, `sm_teamname_t "${team2.name}"`, 'Teamname 2 change');
        }

        /**
         * Change team flags
         */
        this.cmd(server, `mp_teamflag_1 "${team1.country}"`, 'Teamflag 1 change');
        this.cmd(server, `mp_teamflag_2 "${team2.country}"`, 'Teamflag 2 change');

        /**
         * Restart game
         */
        this.cmd(server, 'mp_restartgame 1', 'Restart game');

        log.info(`[RCON][${server}] Server config ready!`);
    }

    /**
     * Starts the warmup for a server
     *
     * @param server
     */
    startWarmup(server) {
        const config = `
            // CS:GO Warmup Config
            // 07.10.2014
            
            mp_maxmoney 250000
            mp_startmoney 250000
            mp_warmuptime 80281
            mp_warmup_start 1
        `;
        const exported_lines = splitByByteLength(csgoConfig.process(config), 512, '; ');

        for(let item = 0; item < exported_lines.length; item++) {
            log.trace(`[RCON] Config Line: ${JSON.stringify(exported_lines[item])}`);
            this.cmd(server, exported_lines[item]);
        }

        log.info(`[RCON][${server}] Warmup config loaded!`);
    }

    /**
     * Function to start a match
     *
     * @param server
     * @param matchInfo
     * @param type
     */
    startMatch(server, matchInfo, type = "main") {
        const match_config = (type === "main") ? matchInfo.match_config : matchInfo.knife_config;
        const message = (type === "main") ? "Live!!!" : "Knife!!!";

        /**
         * Load External config file
         */
        this.loadExternalCSGOConfig(server, match_config, type);

        /**
         * Restart game
         */
        this.cmd(server, 'mp_restartgame 1', 'Restart game');

        /**
         * Inform players
         */
        this.cmd(server, `say '${message}'`, 'Say');
        this.cmd(server, `say '${message}'`, 'Say');
        this.cmd(server, `say '${message}'`, 'Say');

        log.info(`[RCON][${server}] Match config ready and started!`);
    }

    /**
     * Function to reset the server to the default settings
     *
     * @param server
     */
    reset(server) {
        /**
         * Set hostname for match
         */
        this.cmd(server, 'hostname ""', 'Hostname change');

        /**
         * Change teamnames
         */
        this.cmd(server, 'mp_teamname_1 ""', 'Teamname 1 change');
        this.cmd(server, 'mp_teamname_2 ""', 'Teamname 2 change');

        /**
         * Change team flags
         */
        this.cmd(server, 'mp_teamflag_1 ""', 'Teamflag 1 change');
        this.cmd(server, 'mp_teamflag_2 ""', 'Teamflag 2 change');

        /**
         * Load default CSGO config
         */
        this.cmd(server, 'exec gamemode_competitive', 'Gamemode update');

        /**
         * Inform players
         */
        this.cmd(server, 'say "Resetting game settings to default..."', 'Resetting server to default settings and ending match!');

        /**
         * Restart game
         */
        this.cmd(server, 'mp_restartgame 1', 'Restart game');

        /**
         * Load default Server config
         */
        const restoreConfig = this.findServerRestoreConfig(server);
        if(restoreConfig !== false) {
            this.cmd(server, `exec ${this.findServerRestoreConfig(server)}.cfg`, 'Load default server config');
        }

        log.info(`[RCON][${server}] Has been reset to the default configuration!`);
    }

    /**
     * Sends a single command to the rcon server
     *
     * @param server
     * @param cmd
     * @param message
     */
    cmd(server, cmd, message = "CMD Send") {
        queue.add(server, () => {
            this.rcon[server].command(cmd, 5000).then(source => {
                log.trace(`[RCON][${server}] ${message}: `, source);
                queue.complete(server);
            }, err => {
                log.error(`[RCON][${server}] Error: ${err}`);
                queue.complete(server);
            }).catch((error) => {
                log.error(`[RCON][${server}] Catch: ${error}`);
                queue.complete(server);
            });
        });
    }

    /**
     * Checks if the custom CSGO Remote plugin is available on the server
     *
     * @param server
     */
    checkPlugin(server) {
        queue.add(server, () => {
            this.rcon[server].command("sm_csgo_remote").then(source => {
                queue.complete(server);

                try {
                    const available = JSON.parse(source.split("\n")[0]);

                    if(available.enabled) {
                        log.info(`[RCON][${server}] Plugin is available!`);
                        this.pluginAvailable[server] = true;

                        log.trace(`[RCON] Plugin CURL: ${config.application.baseUrl}/api/csgo/${server.split(":")[0]}/${server.split(":")[1]}'`);
                        // Send server URL to use for CURL
                        this.cmd(server, `sm_csgo_remote_url "${config.application.baseUrl}" "api/csgo/${server.split(":")[0]}/${server.split(":")[1]}"`, "Update CSGO Remote CURL URL");
                    } else {
                        log.warn(`[RCON][${server}]: Plugin isn't available!`);
                        this.pluginAvailable[server] = false;
                    }
                } catch(e) {
                    log.warn(`[RCON][${server}]: Plugin isn't available!`);
                    this.pluginAvailable[server] = false;
                }
            }).catch(() => {
                log.warn(`[RCON][${server}]: Plugin isn't available!`);
                queue.complete(server);
                this.pluginAvailable[server] = false;
            });
        });
    }
}

module.exports = new rcon();
