/**
 * Import base packages
 */
const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');
const log = require("./logger");
const db = require("./database").db;
const rcon = require("./rcon");
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

            if (dataString.instruction === "create_match") {
                log.info(`[SOCKET][${ws.id}] Created a new match! RAW: ${JSON.stringify(dataString.data)}`);
                db.push("/match[]", dataString.data);

                informAllSockets('update', {
                    matches: db.getData("/match"),
                    servers: config.servers,
                    maps: config.maps
                });
            }

            if (dataString.instruction === "start_match") {
                log.info(`[SOCKET][${ws.id}] Starts match ID: ${dataString.data.id}`);

                const dbData = db.getData(`/match[${dataString.data.id}]`);
                rcon.connect(dbData.server, dbData, true);

                db.push(`/match[${dataString.data.id}]/status`, 1);
                informAllSockets('update', {
                    matches: db.getData("/match"),
                    servers: config.servers,
                    maps: config.maps
                });
            }

            if (dataString.instruction === "end_match") {
                log.info(`[SOCKET][${ws.id}] Ended match ID: ${dataString.data.id}`);

                const dbData = db.getData(`/match[${dataString.data.id}]`);
                rcon.reset(dbData.server);

                db.push(`/match[${dataString.data.id}]/status`, 2);
                informAllSockets('update', {
                    matches: db.getData("/match"),
                    servers: config.servers,
                    maps: config.maps
                });
            }

            if (dataString.instruction === "disconnect_server") {
                log.info(`[SOCKET][${ws.id}] Disconnects server from match ID: ${dataString.datadata.id}`);

                const dbData = db.getData(`/match[${dataString.data.id}]`);
                rcon.disconnect(dbData.server);
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
        ws.send(encrypt({
            instruction: 'init',
            data: {
                matches: db.getData("/match"),
                servers: config.servers,
                maps: config.maps
            }
        }));

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
