const baseController = require('./BaseController');
const {checkServerAvailability} = require('../../utils/Arrays');
const db = require('../../modules/database').db;

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
        console.log('here');
        console.log('req.body', req.body);

        console.log('req.params', req.params);

        const match = checkServerAvailability(`${req.params.ip}:${req.params.port}`, db.getData("/match"));
        if(match) {
            console.log('match', match);
        }

        this.jsonResponse(res, 200, { 'message': 'OK' });
    }
}

module.exports = new CsgoController();
