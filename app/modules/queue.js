const log = require("./logger");
const config = require("../config");
const queueFailMax = 35;
// let queueFailCurrent = 0;

/**
 * Create globals. The active queue of the application and a var to check if a command is still running
 */
let activeQueue = {};
let commandRunning = {};
let queueFailCurrent = {};

/**
 * Init function to add the servers to the global objects
 */
function init(){
    for(let item = 0; item < config.servers.length; item++){
        activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`] = [];
        commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] = false;
        queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] = 0;
    }
}

/**
 * Function to add a command to the queue
 *
 * @param server string
 * @param command Function
 */
function add(server, command){
    activeQueue[server].push(command);
}

/**
 * Function that must be run when a command is done
 *
 * @param server
 */
function complete(server){
    commandRunning[server] = false;
}

/**
 * Loop over the commands and execute them when possible
 */
setInterval(() => {
    for(let item = 0; item < config.servers.length; item++) {
        if (activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`].length > 0) {
            if (!commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] || queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] === queueFailMax) {
                commandRunning[`${config.servers[item].ip}:${config.servers[item].port}`] = true;

                activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`][0]();
                activeQueue[`${config.servers[item].ip}:${config.servers[item].port}`].splice(0, 1);

                if(queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] === queueFailMax){
                    queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`] = 0;
                    complete(`${config.servers[item].ip}:${config.servers[item].port}`);

                    log.warn(`[QUEUE] Max Queue Fail reached! Cleaning up...`);
                }
            }else{
                queueFailCurrent[`${config.servers[item].ip}:${config.servers[item].port}`]++;
            }
        }
    }
}, 10);

module.exports = {init, add, complete};
