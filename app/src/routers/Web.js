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
        route: '/servers',
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
        route: '/match/:id/edit',
        method: 'get',
        controller: 'Index',
        action: 'index'
    },
    {
        route: '/settings',
        method: 'get',
        controller: 'Index',
        action: 'index',
        secured: true
    }
];

routerUtils.routesToRouter(router, routes, 'Web');

module.exports = {router, routes};
