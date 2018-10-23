/**
 * Import base packages
 */
const express = require('express');
const router = express.Router();
const routerUtils = require('../modules/router');

/**
 * Define routes
 */
const routes = [
    {
        route: '/',
        method: 'get',
        controller: 'Index',
        action: 'index'
    }
];

routerUtils.routesToRouter(router, routes, 'Api');

module.exports = {router, routes};
