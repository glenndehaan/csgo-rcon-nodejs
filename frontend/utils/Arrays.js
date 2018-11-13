/**
 * Find an object in an array by id
 *
 * @param array
 * @param id
 * @return {*}
 */
function findByIdInObjectArray(array, id) {
    for(let item = 0; item < array.length; item++) {
        if(typeof array[item].id !== "undefined" && array[item].id === id) {
            array[item].index = item;
            return array[item];
        }
    }

    return false;
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

export {findByIdInObjectArray, checkServerAvailability};
