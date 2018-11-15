/**
 * Import base config
 */
const baseConfig = require("./baseConfig");

/**
 * Import base packages
 */
const fs = require('fs');
const deepmerge = require('deepmerge');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Export the main config
 */
try {
    module.exports = deepmerge(baseConfig, eval('require')(dev ? __dirname + '/config.json' : process.cwd() + '/config.json'));
} catch (e) {
    const config = fs.readFileSync(__dirname + '/../../../_scripts/config/config.build.json', 'utf8');
    fs.writeFileSync(dev ? __dirname + '/config.json' : process.cwd() + '/config.json', config);

    module.exports = deepmerge(baseConfig, JSON.parse(config));
}
