/**
 * Import test suite
 */
const should = require('should');
const request = require('request');

/**
 * Import packages needed for tests
 */
const log = require("../src/modules/logger");
const database = require("../src/modules/database");
const csgoConfig = require("../src/modules/csgoConfig");
const challonge = require("../src/modules/challonge");

/**
 * Launch test
 */
describe("APP - Functions", () => {
    it('./modules/logger should have a all logger functions', (done) => {
        log.trace.should.be.an.Function();
        log.debug.should.be.an.Function();
        log.info.should.be.an.Function();
        log.warn.should.be.an.Function();
        log.error.should.be.an.Function();
        log.fatal.should.be.an.Function();
        done();
    });

    it('./modules/database should have an init function', (done) => {
        database.init.should.be.a.Function();
        done();
    });

    it('./modules/csgoConfig should have an init function', (done) => {
        csgoConfig.init.should.be.a.Function();
        done();
    });

    it('./modules/challonge should have an init function', (done) => {
        challonge.init.should.be.a.Function();
        done();
    });
});
