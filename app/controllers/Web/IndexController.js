const baseController = require('./BaseController');

class IndexController extends baseController {
    /**
     * Renders the Home page
     *
     * @param req
     * @param res
     */
    indexAction(req, res) {
        res.render('index', this.mergePageConfig(req, {
            template: 'index/index',
            pageTitle: 'Home'
        }));
    }

    /**
     * Renders the 404 page
     *
     * @param req
     * @param res
     */
    notFoundAction(req, res) {
        res.render('index', this.mergePageConfig(req, {
            template: 'general/notfound',
            pageTitle: 'Not Found'
        }));
    }
}

module.exports = new IndexController();
