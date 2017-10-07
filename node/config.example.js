module.exports = {
    application: {
        logLevel: 'info', // trace, debug, info, warn, error or fatal
        companyName: "A Company",
        csgoConfigFolder: "csgo-configs",
        port: 3542,
        host: "0.0.0.0"
    },
    servers: [
        {
            ip: "192.168.1.xx",
            port: 27015,
            password: "anrconpassword",
            default_map: "de_dust2"
        }
    ]
};
