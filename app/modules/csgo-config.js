const fs = require("fs");
const config = require("../config");

/**
 * Grabs CSGO configs from file system
 *
 * @param config_name
 * @param type
 * @param callback
 */
function loadCSGOConfig(config_name, type = "main", callback) {
    fs.readFile(`${__dirname}/../${config.application.csgoConfigFolder}/${type}/${config_name}.txt`, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        callback(data);
    });
}

/**
 * Grabs CSGO configs from file system
 *
 * @param type
 * @param callback
 */
function getConfigs(callback) {
    fs.readdir(`${__dirname}/../${config.application.csgoConfigFolder}/main`, (err, main_files) => {
        if (err) {
            throw err;
        }

        for(let item = 0; item < main_files.length; item++) {
            main_files[item] = main_files[item].replace(/\.[^/.]+$/, "");
        }

        fs.readdir(`${__dirname}/../${config.application.csgoConfigFolder}/knife`, (err, knife_files) => {
            if (err) {
                throw err;
            }

            for(let item = 0; item < knife_files.length; item++) {
                knife_files[item] = knife_files[item].replace(/\.[^/.]+$/, "");
            }

            const files = {
                main: main_files,
                knife: knife_files
            };

            callback(files);
        });
    });
}

module.exports = {loadCSGOConfig, getConfigs};
