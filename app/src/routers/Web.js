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
    },
    {
        route: '/match/create',
        method: 'get',
        controller: 'Index',
        action: 'index'
    },
    {
        route: '/match/:id',
        method: 'get',
        controller: 'Index',
        action: 'index'
    },
    {
        route: '/settings',
        method: 'get',
        controller: 'Index',
        action: 'index'
    }
];

routerUtils.routesToRouter(router, routes, 'Web');

module.exports = {router, routes};
