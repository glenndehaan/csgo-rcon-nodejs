const config = require("../config");

/**
 * Function to split the string by byte length
 *
 * @param data
 * @param length
 * @param lineEndChar
 * @return {*}
 */
function splitByByteLength(data, length = 1024, lineEndChar = '') {
    const lines = data;
    const exportedLines = [];
    let index = 0;

    for(let item = 0; item < lines.length; item++) {
        if(typeof exportedLines[index] === "undefined") {
            exportedLines[index] = "";
        }

        const lineFormatted = `${lines[item]}${lineEndChar}`;
        const lineBytes = Buffer.byteLength(lineFormatted, 'utf8');
        const bufferBytes = Buffer.byteLength(exportedLines[index], 'utf8');

        if((bufferBytes + lineBytes) < length) {
            exportedLines[index] += lineFormatted;
        } else {
            index++;
        }
    }

    return exportedLines;
}

/**
 * Splits a string by line break and returns an array
 *
 * @param data
 * @return {*}
 */
function splitByLinkBreak(data) {
    return data.split('\n');
}

/**
 * Function find the server config that belongs to the server name
 *
 * @param server
 * @return object
 */
function findServerConfig(server) {
    for(let item = 0; item < config.servers.length; item++) {
        const splitted = server.split(":");

        if(config.servers[item].ip === splitted[0] && config.servers[item].port === parseInt(splitted[1])) {
            return config.servers[item];
        }
    }

    return {};
}

module.exports = {splitByByteLength, splitByLinkBreak, findServerConfig};
