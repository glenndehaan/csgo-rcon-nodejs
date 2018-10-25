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

module.exports = {findByChallonge};
