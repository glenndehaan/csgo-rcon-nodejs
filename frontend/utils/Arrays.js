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
            return array[item];
        }
    }

    return false;
}

export {findByIdInObjectArray};
