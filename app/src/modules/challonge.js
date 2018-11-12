const uuidv4 = require('uuid/v4');
const fetch = require("node-fetch");
const log = require("../modules/logger");
const db = require("../modules/database").db;
const {findByChallonge, getAllChallonge} = require("../utils/Arrays");
const {findServerConfig, findServerConfigIndex} = require("../utils/Strings");
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
     * @param matchGroup
     * @param callback
     */
    importMatches(tournamentId, server, knifeConfig, mainConfig, matchGroup, callback) {
        fetch(`https://${config.integrations.challonge.username}:${config.integrations.challonge.key}@api.challonge.com/v1/tournaments/${tournamentId}/matches.json`)
            .then(res => res.json())
            .then(body => {
                const dbData = db.getData("/match");
                let imported = 0;
                let completed = 0;

                for (let item = 0; item < body.length; item++) {
                    const exists = findByChallonge(dbData, body[item].match.id);
                    const matchId = body[item].match.id;
                    const teamId1 = body[item].match.player1_id;
                    const teamId2 = body[item].match.player2_id;

                    if (!exists) {
                        if(teamId1 !== null && teamId2 !== null) {
                            imported++;

                            this.getTeamName(tournamentId, teamId1, (teamName1) => {
                                this.getTeamName(tournamentId, teamId2, (teamName2) => {
                                    let serverDetails = false;

                                    if(server !== "next") {
                                        serverDetails = findServerConfig(server);
                                    } else {
                                        const dbMatches = getAllChallonge();

                                        if(dbMatches.length > 0) {
                                            const server = findServerConfigIndex(dbMatches[dbMatches.length - 1].server);
                                            let serverIndex = 0;

                                            if((server + 1) < config.servers.length) {
                                                serverIndex = server + 1;
                                            }

                                            serverDetails = findServerConfig(`${config.servers[serverIndex].ip}:${config.servers[serverIndex].port}`);
                                        } else {
                                            serverDetails = findServerConfig(`${config.servers[0].ip}:${config.servers[0].port}`);
                                        }
                                    }

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
                                        match_group: matchGroup,
                                        map: serverDetails.default_map,
                                        knife_config: knifeConfig,
                                        match_config: mainConfig,
                                        server: `${serverDetails.ip}:${serverDetails.port}`,
                                        status: 0,
                                        challonge: matchId
                                    });

                                    completed++;

                                    if(imported === completed) {
                                        callback(imported);
                                        log.info(`[CHALLONGE] ${body.length} Matches(s) found! ${imported} Matches(s) imported!`);
                                    }
                                });
                            });
                        }
                    }
                }

                if(imported === 0) {
                    callback(imported);
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
