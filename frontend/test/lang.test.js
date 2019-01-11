/**
 * Import test suite
 */
const should = require('should');
const request = require('request');

/**
 * Import packages needed for tests
 */
const lang = require("../lang").default;

/**
 * Launch test
 */
describe("FRONTEND - Lang", () => {
    it('Lang.js should be defined', (done) => {
        lang.should.be.an.Object();
        done();
    });

    it('Lang.js should contain at least the EN lang', (done) => {
        lang.en.should.be.an.Object();
        done();
    });

    it('Lang.js all lang files should have same category\'s as EN lang', (done) => {
        const langs = Object.keys(lang);
        const categorys = Object.keys(lang.en);

        // Remove EN from langs
        const item = langs.indexOf("en");
        if(item !== -1) {
            langs.splice(item, 1);
        }

        for(let i = 0; i < langs.length; i++) {
            const keys = Object.keys(lang[langs[i]]);
            keys.should.containDeep(categorys);
        }

        done();
    });
});
