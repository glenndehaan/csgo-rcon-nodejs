/**
 * Get an item in the storage
 *
 * @param {string} key
 * @return {null|{}}
 */
const get = (key) => {
    const state = localStorage.getItem(key);
    if (state === null) return null;
    return JSON.parse(state);
};

/**
 * Set an item in the storage
 *
 * @param {string} key
 * @param {*} state
 */
const set = (key, state) => {
    localStorage.setItem(key, JSON.stringify(state));
};

/**
 * Remove an item from the storage
 *
 * @param {string} key
 */
const remove = (key) => {
    localStorage.removeItem(key);
};

export default { get, set, remove };
