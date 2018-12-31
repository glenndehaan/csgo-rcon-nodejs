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
                const serverData = {};
                serverData.status = req.body.status;
                serverData.locked = req.body.locked;
                serverData.match = req.body.match;
                serverData.CT = {
                    team_name: req.body.ct_name,
                    players: []
                };
                serverData.T = {
                    team_name: req.body.t_name,
                    players: []
                };

                for(let player = 0; player < req.body.players.length; player++) {
                    const playerData = req.body.players[player];

                    if(playerData.team === 3) {
                        serverData.CT.players.push(playerData);
                    }

                    if(playerData.team === 2) {
                        serverData.T.players.push(playerData);
                    }
                }

                db.push(`/match[${index}]/server_data`, serverData);

                socket.sendGeneralUpdate();

                // Auto start warmup after knife round
                if (match.status === 2 && (req.body.match.CT === 1 || req.body.match.T === 1)) {
                    log.info(`[API][${req.params.ip}:${req.params.port}] Pausing match since knife round is over!`);
                    db.push(`/match[${index}]/status`, 20);
                    rcon.cmd(`${req.params.ip}:${req.params.port}`, "say 'Waiting for admin to start match...'", 'Auto pause match say');
                    rcon.cmd(`${req.params.ip}:${req.params.port}`, 'exec gamemode_competitive', 'Gamemode update');
                    rcon.startWarmup(`${req.params.ip}:${req.params.port}`);
                }

                if(match.status === 3 && req.body.status === "match_end") {
                    log.info(`[API][${req.params.ip}:${req.params.port}] Restoring server since match is over!`);
                    db.push(`/match[${index}]/status`, 99);
                    rcon.reset(`${req.params.ip}:${req.params.port}`);
                }
            }
        }

        this.jsonResponse(res, 200, { 'message': 'OK' });
    }
}

module.exports = new CsgoController();
