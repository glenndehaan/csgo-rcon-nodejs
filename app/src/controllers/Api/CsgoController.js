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
                db.push(`/match[${index}]/server_data`, req.body);

                socket.sendGeneralUpdate();

                // Auto pause match after knife round
                if (match.status === 1 && (req.body.match.CT === 1 || req.body.match.T === 1)) {
                    log.info(`[API][${req.params.ip}:${req.params.port}] Pausing match since knife round is over!`);
                    rcon.cmd(`${req.params.ip}:${req.params.port}`, 'mp_pause_match', 'Auto pause match');
                    rcon.cmd(`${req.params.ip}:${req.params.port}`, "say 'Waiting for admin to start match...'", 'Auto pause match say');
                }
            }
        }

        this.jsonResponse(res, 200, { 'message': 'OK' });
    }
}

module.exports = new CsgoController();
