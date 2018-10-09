/**
 * Import base packages
 */
const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');
const log = require("./logger");
const db = require("./database").db;
const rcon = require("./rcon");
const csgo_config = require("./csgo-config");
const config = require("../config");

/**
 * Create socket object
 */
let socket = null;

/**
 * Init the socket connection
 */
const init = (server) => {
    socket = require('express-ws')(server);

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
            const dataString = decrypt(data);

            if (typeof dataString.instruction === "undefined" || dataString.instruction === "") {
                global.log.error(`[SOCKET][${ws.id}] No instruction received from socket`);
                return;
            }

            if (dataString.instruction === "match_create") {
                log.info(`[SOCKET][${ws.id}] Created a new match! RAW: ${JSON.stringify(dataString.data)}`);
                db.push("/match[]", dataString.data);

                csgo_config.getConfigs((configs) => {
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
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
                    informAllSockets('update', {
                        matches: db.getData("/match"),
                        servers: config.servers,
                        maps: config.maps,
                        configs
                    });
                });
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
            ws.send(encrypt({
                instruction: 'init',
                data: {
                    matches: db.getData("/match"),
                    servers: config.servers,
                    maps: config.maps,
                    configs
                }
            }));
        });

        log.info(`[SOCKET][${ws.id}] User connected!`)
    });

    log.info(`[SOCKET] WS started!`);
};

/**
 * Function to send info to all sockets
 */
const informAllSockets = (instruction, data) => {
    socket.getWss().clients.forEach(client => {
        // Check if connection is still open
        if (client.readyState !== client.OPEN) return;

        client.send(encrypt({
            instruction,
            data
        }));
    });
};

/**
 * Function encrypt data before sending
 */
const encrypt = (data) => {
    const string = JSON.stringify(data);
    return btoa(string);
};

/**
 * Function decrypt data from socket
 */
const decrypt = (data) => {
    const string = atob(data);
    return JSON.parse(string);
};

module.exports = {socket, init};
