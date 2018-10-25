/**
 * Import base packages
 */
const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');
const log = require("./logger");
const db = require("./database").db;
const rcon = require("./rcon");
const challonge = require("./challonge");
const csgo_config = require("./csgo-config");
const config = require("../config");

class socket {
    /**
     * Constructor
     */
    constructor() {
        this.socket = null;
    }

    /**
     * Init the socket connection
     *
     * @param server
     */
    init(server) {
        this.socket = require('express-ws')(server);

        /**
         * WS main route
         */
        server.ws('/', (ws) => {
            /**
             * Create globals
             */
            ws.id = uuidv4();

            /**
             * Main message bus
             */
            ws.on('message', (data) => {
                const dataString = this.decrypt(data);

                if (typeof dataString.instruction === "undefined" || dataString.instruction === "") {
                    global.log.error(`[SOCKET][${ws.id}] No instruction received from socket`);
                    return;
                }

                if (dataString.instruction === "match_create") {
                    log.info(`[SOCKET][${ws.id}] Created a new match! RAW: ${JSON.stringify(dataString.data)}`);
                    dataString.data.challonge = false;
                    db.push("/match[]", dataString.data);

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "match_start_knife") {
                    log.info(`[SOCKET][${ws.id}] Starts match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.startMatch(dbData.server, dbData, "knife");

                    db.push(`/match[${dataString.data.id}]/status`, 1);
                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "match_start_main") {
                    log.info(`[SOCKET][${ws.id}] Starts match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.startMatch(dbData.server, dbData, "main");

                    db.push(`/match[${dataString.data.id}]/status`, 2);
                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "match_end") {
                    log.info(`[SOCKET][${ws.id}] Ended match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.reset(dbData.server);

                    db.push(`/match[${dataString.data.id}]/status`, 99);
                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_resume") {
                    log.info(`[SOCKET][${ws.id}][game_resume] Match index: ${dataString.data.id}`);

                    db.push(`/match[${dataString.data.id}]/status`, 2);
                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_unpause_match');

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_pause") {
                    log.info(`[SOCKET][${ws.id}][game_pause] Match index: ${dataString.data.id}`);

                    db.push(`/match[${dataString.data.id}]/status`, 50);
                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_pause_match');

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_team_switch") {
                    log.info(`[SOCKET][${ws.id}][game_team_switch] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_swapteams');

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_map_update") {
                    log.info(`[SOCKET][${ws.id}][game_map_update] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, `map ${dataString.data.map}`);

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_say") {
                    log.info(`[SOCKET][${ws.id}][game_say] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, `say ${dataString.data.message}`);

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if (dataString.instruction === "game_restart") {
                    log.info(`[SOCKET][${ws.id}][game_restart] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_restartgame 1');

                    csgo_config.getConfigs((configs) => {
                        this.informAllSockets('update', {
                            matches: db.getData("/match"),
                            servers: config.servers,
                            maps: config.maps,
                            configs
                        });
                    });
                }

                if(config.integrations.challonge.enabled) {
                    if (dataString.instruction === "integrations_challonge_import") {
                        log.info(`[SOCKET][${ws.id}][integrations_challonge_import] Starting challonge import`);
                        challonge.importMatches(dataString.data.tournament, dataString.data.server, dataString.data.knife_config, dataString.data.main_config)
                    }
                }
            });

            /**
             * Function to catch client disconnect
             */
            ws.on('close', () => {
                log.info(`[SOCKET][${ws.id}] Disconnected!`);
            });

            /**
             * Send init data
             */
            csgo_config.getConfigs((configs) => {
                ws.send(this.encrypt({
                    instruction: 'init',
                    data: {
                        matches: db.getData("/match"),
                        servers: config.servers,
                        maps: config.maps,
                        configs,
                        challonge: challonge.tournaments
                    }
                }));
            });

            log.info(`[SOCKET][${ws.id}] User connected!`)
        });

        log.info(`[SOCKET] WS started!`);
    }

    /**
     * Function to send info to all sockets
     *
     * @param instruction
     * @param data
     */
    informAllSockets(instruction, data) {
        this.socket.getWss().clients.forEach(client => {
            // Check if connection is still open
            if (client.readyState !== client.OPEN) return;

            client.send(this.encrypt({
                instruction,
                data
            }));
        });
    }

    /**
     * Send an update with general data to all sockets
     */
    sendGeneralUpdate() {
        csgo_config.getConfigs((configs) => {
            this.informAllSockets('update', {
                matches: db.getData("/match"),
                servers: config.servers,
                maps: config.maps,
                configs
            });
        });
    }

    /**
     * Function encrypt data before sending
     */
    encrypt(data) {
        const string = JSON.stringify(data);
        return btoa(string);
    }

    /**
     * Function decrypt data from socket
     */
    decrypt(data) {
        const string = atob(data);
        return JSON.parse(string);
    }
}

module.exports = new socket();
