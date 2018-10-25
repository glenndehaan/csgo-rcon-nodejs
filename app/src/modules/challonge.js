const fetch = require("node-fetch");
const log = require("../modules/logger");
const config = require("../config");

class challonge {
    constructor() {
        this.tournaments = [];
    }

    /**
     * Get all tournaments from Challonge
     */
    init() {
        fetch(`https://${config.integrations.challonge.username}:${config.integrations.challonge.key}@api.challonge.com/v1/tournaments.json`)
            .then(res => res.json())
            .then(body => {
                if(body.length > 0) {
                    this.tournaments = body;
                } else {
                    this.tournaments = [];
                }

                log.info(`[CHALLONGE] ${this.tournaments.length} Tournament(s) found!`);
            })
            .catch((error) => {
                log.error(`[CHALLONGE] Error: ${error}`);
            });
    }

    /**
     * Import all matches from a tournament into the DB
     *
     * @param tournamentId
     * @param server
     * @param knifeConfig
     * @param mainConfig
     */
    importMatches(tournamentId, server, knifeConfig, mainConfig) {
        fetch(`https://${config.integrations.challonge.username}:${config.integrations.challonge.key}@api.challonge.com/v1/tournaments/${tournamentId}/matches.json`)
            .then(res => res.json())
            .then(body => {
                console.log('body', body);
                log.info(`[CHALLONGE] ${body.length} Matches(s) found!`);
            })
            .catch((error) => {
                log.error(`[CHALLONGE] Error: ${error}`);
            });
    }
}

module.exports = new challonge();
