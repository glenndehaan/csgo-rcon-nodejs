/**
 * Import base packages
 */
//eslint-disable-next-line
const fs = require('fs');

/**
 * Export the main config
 */
try {
    module.exports = eval('fs.readFileSync')(__dirname + '/version.txt', 'utf8').split("\n")[0];
} catch (e) {
    module.exports = "__DEV__";
}
