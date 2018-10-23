const fs = require("fs");
const config = require("../config");

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Grabs CSGO configs from file system
 *
 * @param config_name
 * @param type
 * @param callback
 */
const loadCSGOConfig = (config_name, type = "main", callback) => {
    fs.readFile(`${dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/${type}/${config_name}.txt`, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        callback(processConfig(data));
    });
};

/**
 * Removes all comments and other unneeded stuff
 *
 * @param data
 * @return array
 */
const processConfig = (data) => {
    data = data.replace(/^\/\/.*$/m, '');
    data = data.split("\n");
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
        const line = data[i].trim();
        const segments = line.split(' ');

        if(segments[0] === 'say') {
            newData.push(line);
        } else if (segments[0] !== '' && segments[0] !== '//') {
            newData.push(`${segments[0]} ${segments[1].split('\t')[0]}`);
        }
    }

    return newData;
};

/**
 * Grabs CSGO configs from file system
 *
 * @param callback
 */
const getConfigs = (callback) => {
    fs.readdir(`${dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/main`, (err, main_files) => {
        if (err) {
            throw err;
        }

        for(let item = 0; item < main_files.length; item++) {
            main_files[item] = main_files[item].replace(/\.[^/.]+$/, "");
        }

        fs.readdir(`${dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/knife`, (err, knife_files) => {
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
};

module.exports = {loadCSGOConfig, getConfigs};
