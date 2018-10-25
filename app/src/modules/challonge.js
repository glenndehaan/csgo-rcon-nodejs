const uuidv4 = require('uuid/v4');
const fetch = require("node-fetch");
const log = require("../modules/logger");
const db = require("../modules/database").db;
const {findByChallonge} = require("../utils/Arrays");
const {findServerConfig} = require("../utils/Strings");
const config = require("../config");

class challonge {
    constructor() {
        this.tournaments = [];
        this.socket = null;
    }

    /**
     * Get all tournaments from Challonge
     *
     * @param socket
     */
    init(socket) {
        this.socket = socket;

        fetch(`https://${config.integrations.challonge.username}:${config.integrations.challonge.key}@api.challonge.com/v1/tournaments.json`)
            .then(res => res.json())
            .then(body => {
                if (body.length > 0) {
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
                const dbData = db.getData("/match");
                let imported = 0;
                let completed = 0;

                for (let item = 0; item < body.length; item++) {
                    const serverDetails = findServerConfig(server);
                    const exists = findByChallonge(dbData, body[item].match.id);
                    const matchId = body[item].match.id;
                    const teamId1 = body[item].match.player1_id;
                    const teamId2 = body[item].match.player2_id;

                    if (!exists) {
                        if(teamId1 !== null && teamId2 !== null) {
                            imported++;

                            this.getTeamName(tournamentId, teamId1, (teamName1) => {
                                this.getTeamName(tournamentId, teamId2, (teamName2) => {
                                    db.push("/match[]", {
                                        id: uuidv4(),
                                        team1: {
                                            name: teamName1,
                                            country: config.integrations.challonge.default_country
                                        },
                                        team2: {
                                            name: teamName2,
                                            country: config.integrations.challonge.default_country
                                        },
                                        map: serverDetails.default_map,
                                        knife_config: knifeConfig,
                                        match_config: mainConfig,
                                        server: server,
                                        status: 0,
                                        challonge: matchId
                                    });

                                    completed++;

                                    if(imported === completed) {
                                        this.socket.sendGeneralUpdate();
                                        log.info(`[CHALLONGE] ${body.length} Matches(s) found! ${imported} Matches(s) imported!`);
                                    }
                                });
                            });
                        }
                    }
                }

                if(imported === 0) {
                    log.info(`[CHALLONGE] No new matches(s) found!`);
                }
            })
            .catch((error) => {
                log.error(`[CHALLONGE] Error: ${error}`);
            });
    }

    /**
     * Returns the team name
     *
     * @param tournamentId
     * @param teamId
     * @param callback
     */
    getTeamName(tournamentId, teamId, callback) {
        fetch(`https://${config.integrations.challonge.username}:${config.integrations.challonge.key}@api.challonge.com/v1/tournaments/${tournamentId}/participants/${teamId}.json`)
            .then(res => res.json())
            .then(body => {
                callback(body.participant.name);
            })
            .catch((error) => {
                log.error(`[CHALLONGE] Error: ${error}`);
                callback(false);
            });
    }
}

module.exports = new challonge();
