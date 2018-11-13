/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Exports the base config
 */
module.exports = {
    application: {
        name: "CSGO Remote",
        env: dev ? " (local)" : "",
        basePath: "/"
    }
};
