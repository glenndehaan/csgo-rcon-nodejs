const database = require("../modules/database").db;

/**
 * Find the challonge param in an array
 *
 * @param array
 * @param challonge
 * @return bool|object
 */
function findByChallonge(array, challonge) {
    for(let item = 0; item < array.length; item++) {
        if(array[item].challonge === challonge) {
            return array[item];
        }
    }

    return false;
}

/**
 * Get all matches from challonge that are stored in the DB
 *
 * @return {*}
 */
function getAllChallonge() {
    const matches = database.getData("/match");
    const challongeMatches = [];

    for(let item = 0; item < matches.length; item++) {
        if(matches[item].challonge !== false) {
            challongeMatches.push(matches[item]);
        }
    }

    return challongeMatches;
}

/**
 * Checks if a server is in use by a match
 *
 * @param server
 * @param matches
 * @return {*}
 */
function checkServerAvailability(server, matches) {
    for(let item = 0; item < matches.length; item++) {
        const match = matches[item];

        if(match.status > 0 && match.status < 99 && match.server === server) {
            return match;
        }
    }

    return false;
}

module.exports = {findByChallonge, getAllChallonge, checkServerAvailability};
