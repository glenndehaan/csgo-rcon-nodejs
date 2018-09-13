const fs = require("fs");
const config = require("../config.js");

/**
 * Grabs CSGO configs from file system
 *
 * @param match_config
 * @param callback
 */
function loadCSGOConfig(match_config, callback) {
    fs.readFile(`${__dirname}/../${match_config}.txt`, (err, data) => {
        if (err) {
            throw err;
        }

        callback(data);
    });
}

module.exports = {loadCSGOConfig};
