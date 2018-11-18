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
const csgoConfig = require("./csgoConfig");
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

                if (dataString.instruction === "general_wants_update") {
                    log.info(`[SOCKET][${ws.id}] Requests an update! RAW: ${JSON.stringify(dataString.data)}`);

                    csgoConfig.index((configs) => {
                        ws.send(this.encrypt({
                            instruction: 'update',
                            data: {
                                matches: db.getData("/match"),
                                groups: db.getData("/group"),
                                servers: config.servers,
                                maps: config.maps,
                                configs,
                                challonge: challonge.tournaments
                            }
                        }));
                    });
                }

                if (dataString.instruction === "group_create") {
                    log.info(`[SOCKET][${ws.id}] Created a new group! RAW: ${JSON.stringify(dataString.data)}`);
                    db.push("/group[]", dataString.data.group);

                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "match_create") {
                    log.info(`[SOCKET][${ws.id}] Created a new match! RAW: ${JSON.stringify(dataString.data)}`);
                    dataString.data.challonge = false;
                    db.push("/match[]", dataString.data);

                    this.sendGeneralUpdate();
                    this.informAllSockets("notification", {
                        system: true,
                        message: `New match available: ${dataString.data.team1.name} v/s ${dataString.data.team2.name}`
                    });
                }

                if (dataString.instruction === "match_edit") {
                    log.info(`[SOCKET][${ws.id}] Edited a match! RAW: ${JSON.stringify(dataString.data)}`);
                    dataString.data.challonge = false;

                    const matches = db.getData("/match");
                    let index = 0;

                    for(let item = 0; item < matches.length; item++) {
                        if(matches[item].id === dataString.data.id) {
                            index = item;
                        }
                    }

                    db.push(`/match[${index}]`, dataString.data);

                    this.sendGeneralUpdate();
                    this.informAllSockets("notification", {
                        system: true,
                        message: `New match available: ${dataString.data.team1.name} v/s ${dataString.data.team2.name}`
                    });
                }

                if (dataString.instruction === "match_start_knife") {
                    log.info(`[SOCKET][${ws.id}] Starts match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.startMatch(dbData.server, dbData, "knife");

                    db.push(`/match[${dataString.data.id}]/status`, 1);
                    this.sendGeneralUpdate();
                    this.informAllSockets("notification", {
                        system: true,
                        message: `Knife round started! Match: ${dbData.team1.name} v/s ${dbData.team2.name}`
                    });
                }

                if (dataString.instruction === "match_start_main") {
                    log.info(`[SOCKET][${ws.id}] Starts match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.startMatch(dbData.server, dbData, "main");

                    db.push(`/match[${dataString.data.id}]/status`, 2);
                    this.sendGeneralUpdate();
                    this.informAllSockets("notification", {
                        system: true,
                        message: `Match started! Match: ${dbData.team1.name} v/s ${dbData.team2.name}`
                    });
                }

                if (dataString.instruction === "match_end") {
                    log.info(`[SOCKET][${ws.id}] Ended match ID: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.reset(dbData.server);

                    db.push(`/match[${dataString.data.id}]/status`, 99);
                    this.sendGeneralUpdate();
                    this.informAllSockets("notification", {
                        system: true,
                        message: `Match ended! Match: ${dbData.team1.name} v/s ${dbData.team2.name}`
                    });
                }

                if (dataString.instruction === "game_resume") {
                    log.info(`[SOCKET][${ws.id}][game_resume] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_unpause_match');

                    db.push(`/match[${dataString.data.id}]/status`, 2);
                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "game_pause") {
                    log.info(`[SOCKET][${ws.id}][game_pause] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_pause_match');

                    db.push(`/match[${dataString.data.id}]/status`, 50);
                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "game_team_switch") {
                    log.info(`[SOCKET][${ws.id}][game_team_switch] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_swapteams');

                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "game_map_update") {
                    log.info(`[SOCKET][${ws.id}][game_map_update] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, `map ${dataString.data.map}`);

                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "game_say") {
                    log.info(`[SOCKET][${ws.id}][game_say] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, `say ${dataString.data.message}`);

                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "game_restart") {
                    log.info(`[SOCKET][${ws.id}][game_restart] Match index: ${dataString.data.id}`);

                    const dbData = db.getData(`/match[${dataString.data.id}]`);
                    rcon.cmd(dbData.server, 'mp_restartgame 1');

                    this.sendGeneralUpdate();
                }

                if(config.integrations.challonge.enabled) {
                    if (dataString.instruction === "integrations_challonge_import") {
                        log.info(`[SOCKET][${ws.id}][integrations_challonge_import] Starting challonge import`);
                        challonge.importMatches(dataString.data.tournament, dataString.data.server, dataString.data.knife_config, dataString.data.match_config, dataString.data.match_group, (imported) => {
                            if(imported > 0) {
                                this.sendGeneralUpdate();
                            }

                            ws.send(this.encrypt({
                                instruction: 'notification',
                                data: {
                                    system: false,
                                    message: `Challonge import complete! Imported ${imported} new matches`,
                                    color: 'success'
                                }
                            }));
                        });
                    }
                }

                if (dataString.instruction === "integrations_archive") {
                    log.info(`[SOCKET][${ws.id}][integrations_archive] Starting archive process`);
                    const matches = db.getData("/match");

                    for(let item = 0; item < matches.length; item++) {
                        if(matches[item].status === 99) {
                            db.push(`/match[${item}]/status`, 100);
                        }
                    }

                    this.sendGeneralUpdate();
                }

                if (dataString.instruction === "integrations_force_archive") {
                    log.info(`[SOCKET][${ws.id}][integrations_archive] Force archive match: ${dataString.data.id}`);
                    db.push(`/match[${dataString.data.id}]/status`, 100);

                    this.sendGeneralUpdate();
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
            csgoConfig.index((configs) => {
                ws.send(this.encrypt({
                    instruction: 'init',
                    data: {
                        matches: db.getData("/match"),
                        groups: db.getData("/group"),
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
        csgoConfig.index((configs) => {
            this.informAllSockets('update', {
                groups: db.getData("/group"),
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
