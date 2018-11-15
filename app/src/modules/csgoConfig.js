const fs = require("fs");
const log = require("./logger");
const config = require("../config");

class csgoConfig {
    /**
     * Constructor
     */
    constructor() {
        this.dev = process.env.NODE_ENV !== 'production';
    }

    /**
     * Writes some default csgo configs to the filesystem
     */
    init() {
        if (!fs.existsSync(`${process.cwd()}/${config.application.csgoConfigFolder}`)) {
            fs.mkdirSync(`${process.cwd()}/${config.application.csgoConfigFolder}`);
            fs.mkdirSync(`${process.cwd()}/${config.application.csgoConfigFolder}/main`);
            fs.mkdirSync(`${process.cwd()}/${config.application.csgoConfigFolder}/knife`);

            const main_files = fs.readdirSync(`${__dirname}/../../../_scripts/csgo-configs/main`);
            const knife_files = fs.readdirSync(`${__dirname}/../../../_scripts/csgo-configs/knife`);

            for (let main = 0; main < main_files.length; main++) {
                log.info(`[CSGO-CONFIG] Copy file: ${__dirname}/../../../_scripts/csgo-configs/main -> ${process.cwd()}/${config.application.csgoConfigFolder}/main/${main_files[main]} `);

                fs.writeFileSync(`${process.cwd()}/${config.application.csgoConfigFolder}/main/${main_files[main]}`, fs.readFileSync(`${__dirname}/../../../_scripts/csgo-configs/main/${main_files[main]}`, 'utf8'));
            }

            for (let knife = 0; knife < knife_files.length; knife++) {
                log.info(`[CSGO-CONFIG] Copy file: ${__dirname}/../../../_scripts/csgo-configs/knife/${knife_files[knife]} -> ${process.cwd()}/${config.application.csgoConfigFolder}/knife/${knife_files[knife]}`);

                fs.writeFileSync(`${process.cwd()}/${config.application.csgoConfigFolder}/knife/${knife_files[knife]}`, fs.readFileSync(`${__dirname}/../../../_scripts/csgo-configs/knife/${knife_files[knife]}`, 'utf8'));
            }
        }
    }

    /**
     * Grabs CSGO configs from file system
     *
     * @param callback
     */
    index(callback) {
        fs.readdir(`${this.dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/main`, (err, main_files) => {
            if (err) {
                throw err;
            }

            for(let item = 0; item < main_files.length; item++) {
                main_files[item] = main_files[item].replace(/\.[^/.]+$/, "");
            }

            fs.readdir(`${this.dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/knife`, (err, knife_files) => {
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

    /**
     * Grabs CSGO configs from file system
     *
     * @param config_name
     * @param type
     * @param callback
     */
    load(config_name, type = "main", callback) {
        fs.readFile(`${this.dev ? __dirname + '/..' : process.cwd()}/${config.application.csgoConfigFolder}/${type}/${config_name}.txt`, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            callback(this.process(data));
        });
    }

    /**
     * Removes all comments and other unneeded stuff
     *
     * @param data
     * @return array
     */
    process(data) {
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
    }
}

module.exports = new csgoConfig();
