const config = require("../config");

class router {
    /**
     * An easy to use function to add multiple routes to the Express router
     *
     * @param router
     * @param routes
     * @param type
     */
    routesToRouter(router, routes, type) {
        for (let item = 0; item < routes.length; item += 1) {
            const route = routes[item];
            const controller = route.controller.charAt(0).toUpperCase() + route.controller.slice(1);
            let auth = '';
            if (route.secured) {
                auth = `basicAuth({users:{${config.authentication.username}:'${config.authentication.password}'},challenge: true}),`;
            }

            eval(
                `
                    ${route.secured ? 'const basicAuth = require("express-basic-auth");' : ''}
                    const ${route.controller}Controller = require('../controllers/${type}/${controller}Controller');
                    router.${route.method}('${route.route}', ${auth} (req, res) => {
                        ${route.controller}Controller.${route.action}Action(req, res);
                    });
                `
            );
        }
    }
}

module.exports = new router();
