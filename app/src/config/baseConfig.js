/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Exports the base config
 */
module.exports = {
    application: {
        name: "CSGO Remote",
        env: dev ? " (local)" : "",
        basePath: "/",
        csgoConfigFolder: "./csgo-configs",
        host: "0.0.0.0",
        port: 3542
    },
    logger: {
        location: "./log",
        level: "info"
    },
    maps: {
        competitive: [
            "de_inferno",
            "de_train",
            "de_mirage",
            "de_nuke",
            "de_overpass",
            "de_cache",
            "de_dust2"
        ],
        wingman: [
            "de_cbble",
            "de_inferno",
            "de_lake",
            "de_overpass",
            "gd_rialto",
            "de_shortdust",
            "de_shortnuke",
            "de_train"
        ],
        dangerzone: [
            "dz_blacksite"
        ]
    },
    integrations: {
        challonge: {
            enabled: false,
            username: "challonge username",
            key: "api key",
            default_country: "NL"
        },
        csv: {
            default_country: "NL"
        }
    }
};
