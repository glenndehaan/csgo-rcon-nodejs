/**
 * Import base packages
 */
const fs = require('fs');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Export the main config
 */
try {
    module.exports = eval('require')(dev ? __dirname + '/config.json' : process.cwd() + '/config.json');
} catch (e) {
    const config = fs.readFileSync(__dirname + '/../../../_scripts/config/config.example.json', 'utf8');
    fs.writeFileSync(dev ? __dirname + '/config.json' : process.cwd() + '/config.json', config);

    module.exports = JSON.parse(config);
}
