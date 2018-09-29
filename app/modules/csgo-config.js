const fs = require("fs");
const config = require("../config");

/**
 * Grabs CSGO configs from file system
 *
 * @param match_config
 * @param callback
 */
function loadCSGOConfig(match_config, callback) {
    fs.readFile(`${__dirname}/../${config.application.csgoConfigFolder}/${match_config}.txt`, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        callback(data);
        console.log('data', data);
    });
}

module.exports = {loadCSGOConfig};