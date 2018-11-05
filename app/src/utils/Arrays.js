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

module.exports = {findByChallonge, getAllChallonge};
