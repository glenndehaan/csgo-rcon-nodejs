const baseController = require('./BaseController');
const log = require('../../modules/logger');
const db = require('../../modules/database').db;
const socket = require('../../modules/socket');
const rcon = require('../../modules/rcon');
const {findIndexById, checkServerAvailability} = require('../../utils/Arrays');

class CsgoController extends baseController {
    constructor() {
        super();
    }

    /**
     * Action for the default api route
     *
     * @param req
     * @param res
     */
    indexAction(req, res) {
        const match = checkServerAvailability(`${req.params.ip}:${req.params.port}`, db.getData("/match"));
        const index = findIndexById(db.getData("/match"), match.id);

        if(match && index) {
            if(typeof match.server_data.locked === "undefined" || match.server_data.locked === false) {
                log.info(`[API][${req.params.ip}:${req.params.port}] Server send live score update`);
                console.log('JSON.stringify(req.body)', JSON.stringify(req.body));

                // Update general match info on round_update
                if(req.body.instruction === "round_update") {
                    const serverData = {};
                    serverData.status = req.body.data.status;
                    serverData.locked = req.body.data.locked;
                    serverData.match = req.body.data.match;
                    serverData.killFeed = [];
                    serverData.CT = {
                        team_name: !req.body.data.half_time ? req.body.data.ct_name : req.body.data.t_name,
                        players: []
                    };
                    serverData.T = {
                        team_name: !req.body.data.half_time ? req.body.data.t_name : req.body.data.ct_name,
                        players: []
                    };

                    for (let player = 0; player < req.body.data.players.length; player++) {
                        const playerData = req.body.data.players[player];

                        if (playerData.team === 3) {
                            serverData.CT.players.push(playerData);
                        }

                        if (playerData.team === 2) {
                            serverData.T.players.push(playerData);
                        }
                    }

                    db.push(`/match[${index}]/server_data`, serverData);
                    socket.sendGeneralUpdate();
                }

                // Update kill feed based on player_killed
                if(req.body.instruction === "player_killed") {

                }

                // Auto start warmup after knife round
                if(req.body.instruction === "round_update") {
                    if (match.status === 2 && (req.body.data.match.CT === 1 || req.body.data.match.T === 1)) {
                        log.info(`[API][${req.params.ip}:${req.params.port}] Pausing match since knife round is over!`);
                        db.push(`/match[${index}]/status`, 20);
                        rcon.cmd(`${req.params.ip}:${req.params.port}`, "say 'Waiting for admin to start match...'", 'Auto pause match say');
                        rcon.cmd(`${req.params.ip}:${req.params.port}`, 'exec gamemode_competitive', 'Gamemode update');
                        rcon.startWarmup(`${req.params.ip}:${req.params.port}`);
                    }
                }

                // Auto restore server after the match is complete
                if(req.body.instruction === "round_update") {
                    if (match.status === 3 && req.body.data.status === "match_end") {
                        log.info(`[API][${req.params.ip}:${req.params.port}] Restoring server since match is over!`);
                        db.push(`/match[${index}]/status`, 99);
                        rcon.reset(`${req.params.ip}:${req.params.port}`);
                    }
                }
            }
        }

        this.jsonResponse(res, 200, { 'message': 'OK' });
    }
}

module.exports = new CsgoController();
