/**
 * Generates a random ID
 *
 * @return {string}
 */
function generateId() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 60; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Prepend the 0 if we need it
 *
 * @param time
 * @return {*}
 */
function fixTimeCalculation(time) {
    if(time < 10){
        return `0${time}`;
    } else {
        return time
    }
}

export {generateId, fixTimeCalculation};
