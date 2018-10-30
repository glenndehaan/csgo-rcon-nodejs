/**
 * Get an item in the storage
 *
 * @param {string} key
 * @return {null|{}}
 */
function get(key) {
    const state = localStorage.getItem(key);
    if (state === null) return null;
    return JSON.parse(state);
}

/**
 * Set an item in the storage
 *
 * @param {string} key
 * @param {*} state
 */
function set(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Remove an item from the storage
 *
 * @param {string} key
 */
function remove(key) {
    localStorage.removeItem(key);
}

export default { get, set, remove };
