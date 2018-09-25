const app = require('http').createServer();
const io = require('socket.io')(app);
const log = require("./logger");
const db = require("./database").db;
const rcon = require("./rcon");
const config = require("../config");

/**
 * Init the socket connection
 */
function init() {
    io.on('connection', function (socket) {
        socket.emit('init', {
            matches: db.getData("/match"),
            servers: config.servers
        });

        socket.on('create_match', function (data) {
            log.info(`[SOCKET][${socket.id}] Created a new match! RAW: ${JSON.stringify(data)}`);
            db.push("/match[]", data);

            io.sockets.emit('update', {
                matches: db.getData("/match"),
                servers: config.servers
            });
        });

        socket.on('start_match', function (data) {
            log.info(`[SOCKET][${socket.id}] Starts match ID: ${data.id}`);

            const dbData = db.getData(`/match[${data.id}]`);
            rcon.connect(dbData.server, dbData, true);

            db.push(`/match[${data.id}]/status`, 1);
            io.sockets.emit('update', {
                matches: db.getData("/match"),
                servers: config.servers
            });
        });

        socket.on('end_match', function (data) {
            log.info(`[SOCKET][${socket.id}] Ended match ID: ${data.id}`);

            const dbData = db.getData(`/match[${data.id}]`);
            rcon.reset(dbData.server);

            db.push(`/match[${data.id}]/status`, 2);
            io.sockets.emit('update', {
                matches: db.getData("/match"),
                servers: config.servers
            });
        });

        socket.on('disconnect_server', function (data) {
            log.info(`[SOCKET][${socket.id}] Disconnects server from match ID: ${data.id}`);

            const dbData = db.getData(`/match[${data.id}]`);
            rcon.disconnect(dbData.server);
        });

        log.info(`[SOCKET] New client connected! ID: ${socket.id}`);
    });

    /**
     * Start listening on the right port/host for the Socket.IO server
     */
    app.listen(config.application.port, config.application.host);
    log.info(`[SYSTEM] Socket.IO started on: ${config.application.host}:${config.application.port}`);
}

module.exports = {io, init};
