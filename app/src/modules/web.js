/**
 * Import base packages
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

/**
 * Import own packages
 */
const log = require("./logger");
const config = require("../config");
const socket = require("./socket");
const webRouter = require('../routers/Web');
const apiRouter = require('../routers/Api');
const indexController = require('../controllers/Web/IndexController');

class web {
    /**
     * Init the express app
     */
    init() {
        /**
         * Trust proxy
         */
        app.enable('trust proxy');

        /**
         * Set template engine
         */
        app.set('view engine', 'ejs');
        app.set('views', `${__dirname}/../views`);

        /**
         * Setup socket
         */
        socket.init(app);

        /**
         * Enable compression
         */
        app.use(compression({ threshold: 0 }));

        /**
         * Serve static public dir
         */
        app.use(express.static(`${__dirname}/../../../public`));

        /**
         * Configure app to use bodyParser()
         */
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

        /**
         * Request logger
         */
        app.use((req, res, next) => {
            log.trace(`[WEB][REQUEST]: ${req.originalUrl}`);
            next();
        });

        /**
         * Configure routers
         */
        app.use('/', webRouter.router);
        app.use('/api', apiRouter.router);

        /**
         * Setup default 404 message
         */
        app.use((req, res) => {
            res.status(404);

            // respond with json
            if (req.originalUrl.split('/')[1] === 'api') {

                /**
                 * API 404 not found
                 */
                res.send({error: 'This API route is not implemented yet'});
                return;
            }

            indexController.notFoundAction(req, res);
        });

        /**
         * Disable powered by header for security reasons
         */
        app.disable('x-powered-by');

        /**
         * Start listening on port
         */
        app.listen(config.application.port, config.application.host, () => {
            log.info(`[WEB] App is running on: ${config.application.host}:${config.application.port}`);
        });
    }
}

module.exports = new web();
