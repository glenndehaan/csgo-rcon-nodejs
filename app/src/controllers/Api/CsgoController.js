const baseController = require('./BaseController');
const log = require('../../modules/logger');
const db = require('../../modules/database').db;
const socket = require('../../modules/socket');
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
            log.info(`[API][${req.params.ip}:${req.params.port}] Server send live score update`);
            db.push(`/match[${index}]/server_data`, req.body);

            socket.sendGeneralUpdate();
        }

        this.jsonResponse(res, 200, { 'message': 'OK' });
    }
}

module.exports = new CsgoController();
