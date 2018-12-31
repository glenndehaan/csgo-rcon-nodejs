import {h, Component} from 'preact';
import { route } from 'preact-router';
import { connect } from "unistore/preact";

import Socket from "../modules/socket";

import {statusResolver} from "../utils/Strings";
import {findByIdInObjectArray, checkServerAvailabilityForMatch} from "../utils/Arrays";
import Alert from "./partials/Alert";

class Detail extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            match: null,
            showConnectDialog: false,
            showRestartDialog: false,
            serverAvailable: true
        };

        this.fields = {
            map: null,
            message: null
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        const match = findByIdInObjectArray(this.props.matches, this.props.id);

        this.setState({
            match: match,
            serverAvailable: !checkServerAvailabilityForMatch(this.props.id, match.server, this.props.matches)
        });

        console.log('this.state.match', this.state.match);

        if (this.state.match === false) {
            return;
        }

        document.title = `Match ${this.state.match.team1.name} v/s ${this.state.match.team2.name} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "name": `Match ${this.state.match.team1.name} v/s ${this.state.match.team2.name}`,
                "url": false
            }
        ]);
    }

    /**
     * Runs when the component updates
     *
     * @param previousProps
     */
    componentDidUpdate(previousProps) {
        if(previousProps !== this.props) {
            const match = findByIdInObjectArray(this.props.matches, this.props.id);

            this.setState({
                match: match,
                serverAvailable: !checkServerAvailabilityForMatch(this.props.id, match.server, this.props.matches)
            });
        }
    }

    /**
     * Connects to the server
     */
    connectServer() {
        this.closeConnectDialog();

        window.events.emit("notification", {
            title: "Connecting to server...",
            color: "primary"
        });

        Socket.send("match_connect_server", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Starts the warmup
     */
    startWarmup() {
        window.events.emit("notification", {
            title: "Warmup starting...",
            color: "primary"
        });

        Socket.send("match_start_warmup", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Starts the knife round
     */
    startKnife() {
        window.events.emit("notification", {
            title: "Knife round starting...",
            color: "primary"
        });

        Socket.send("match_start_knife", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Starts the match
     */
    startMatch() {
        window.events.emit("notification", {
            title: "Match starting...",
            color: "primary"
        });

        Socket.send("match_start_main", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Ends the match
     */
    endMatch() {
        window.events.emit("notification", {
            title: "Ending match...",
            color: "primary"
        });

        Socket.send("match_end", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Resumes the game
     */
    resumeGame() {
        window.events.emit("notification", {
            title: "Resuming game...",
            color: "primary"
        });

        Socket.send("game_resume", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Pauses the game
     */
    pauseGame() {
        window.events.emit("notification", {
            title: "Pausing game...",
            color: "primary"
        });

        Socket.send("game_pause", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Switches the teams in game
     */
    switchTeamSides() {
        window.events.emit("notification", {
            title: "Switching team sides...",
            color: "primary"
        });

        Socket.send("game_team_switch", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Switches the map
     */
    switchMap() {
        window.events.emit("notification", {
            title: "Switching map...",
            color: "primary"
        });

        // Reset checks
        this.fields.map.classList.remove("is-invalid");

        if(this.fields.map.value === "false" || this.fields.map.value === false) {
            this.fields.map.classList.add("is-invalid");
        } else {
            Socket.send("game_map_update", {
                id: parseInt(this.state.match.index),
                map: this.fields.map.value
            });
        }
    }

    /**
     * Sends a message to the server
     */
    sendMessage() {
        window.events.emit("notification", {
            title: "Sending message...",
            color: "primary"
        });

        // Reset checks
        this.fields.message.classList.remove("is-invalid");

        if(this.fields.message.value === "") {
            this.fields.message.classList.add("is-invalid");
        } else {
            Socket.send("game_say", {
                id: parseInt(this.state.match.index),
                message: this.fields.message.value
            });

            this.fields.message.value = "";
        }
    }

    /**
     * Restart the game
     */
    restartGame() {
        this.closeRestartGameDialog();

        window.events.emit("notification", {
            title: "Game restarting...",
            color: "primary"
        });

        Socket.send("game_restart", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Shows the restart game dialog
     */
    showConnectDialog() {
        this.setState({
            showConnectDialog: true
        });
    }

    /**
     * Hide the restart game dialog
     */
    closeConnectDialog() {
        this.setState({
            showConnectDialog: false
        });
    }

    /**
     * Shows the restart game dialog
     */
    showRestartGameDialog() {
        this.setState({
            showRestartDialog: true
        });
    }

    /**
     * Hide the restart game dialog
     */
    closeRestartGameDialog() {
        this.setState({
            showRestartDialog: false
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        if(this.state.match !== null) {
            if(this.state.match === false) {
                window.events.emit("notification", {
                    title: "Match not found!",
                    color: "danger"
                });

                route('/');
                return;
            }
        }

        if(this.state.match) {
            return (
                <div className="starter-template">
                    {this.state.showConnectDialog ? <Alert yes={() => this.connectServer()} no={() => this.closeConnectDialog()} title="Connect to server?" body="Please note: Make sure that at least one CS:GO client is connected with the server before clicking yes!"/> : null}
                    {this.state.showRestartDialog ? <Alert yes={() => this.restartGame()} no={() => this.closeRestartGameDialog()} title="Restart game?" body="Warning! This will set all scores to 0 and restart the complete match!"/> : null}
                    <h3>Match {this.state.match.team1.name} v/s {this.state.match.team2.name}</h3>
                    <div className="row">
                        <div className="col-md-8">
                            <h4>Match details</h4>
                            <div>
                                Match Group: {this.state.match.match_group}<br/>
                                <br/>
                                Team 1 Name: {this.state.match.team1.name}<br/>
                                Team 1 Country: {this.state.match.team1.country}<br/>
                                <br/>
                                Team 2 Name: {this.state.match.team2.name}<br/>
                                Team 2 Country: {this.state.match.team2.country}<br/>
                                <br/>
                                Server: {this.state.match.server}<br/>
                                Map: {this.state.match.map}<br/>
                                CSGO Knife Config: {this.state.match.knife_config}<br/>
                                CSGO Main Config: {this.state.match.match_config}<br/>
                                Current match status: {`${statusResolver(this.state.match.status)} (${this.state.match.status})`}<br/>
                            </div><br/>
                            <h4>Live scoring</h4>
                            {!this.state.match.server_data && <span className="status-error">No scores available yet...</span>}
                            {this.state.match.server_data && this.renderLiveScoring(this.state.match)}
                        </div>
                        <div className="col-md-4 mt-5 mt-md-0">
                            <h4>Match controls</h4>
                            {this.state.match.status >= 99 && <span className="status-error">Match controls locked! Reason:<br/>This match has already ended!</span>}
                            {this.state.match.status < 99 && !this.state.serverAvailable && <span className="status-error">Match controls locked! Reason:<br/>Another match is already running on the same server!</span>}
                            <div>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status >= 99 || !this.state.serverAvailable} onClick={() => this.showConnectDialog()}>
                                    Connect server
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.startWarmup()}>
                                    Start warmup
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.startKnife()}>
                                    Start knife round
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.startMatch()}>
                                    Start match
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.endMatch()}>
                                    End Match & Restore Server
                                </button>
                                <br/>
                            </div><br/>
                            <h4>Server controls</h4>
                            {this.state.match.status === 0 && <span className="status-error">Server controls locked! Reason:<br/>This match is not started!</span>}
                            {this.state.match.status >= 99 && <span className="status-error">Server controls locked! Reason:<br/>This match has already ended!</span>}
                            <div>
                                <div className="btn-group" role="group">
                                    <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.resumeGame()}>
                                        Resume game
                                    </button>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.pauseGame()}>
                                        Pause game
                                    </button>
                                </div>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.switchTeamSides()}>
                                    Switch team sides
                                </button>
                                <br/>
                                <select name="map" id="map" title="map" className="form-control" disabled={this.state.match.status === 0 || this.state.match.status >= 99} ref={c => this.fields.map = c}>
                                    <option selected disabled value="false">Select map</option>
                                    {this.props.maps.map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))}
                                </select>
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.switchMap()}>
                                    Switch map
                                </button>
                                <br/>
                                <input type="text" className="form-control" name="message" id="message" title="message" disabled={this.state.match.status === 0 || this.state.match.status >= 99} ref={c => this.fields.message = c} />
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.sendMessage()}>
                                    Say
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-danger btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.showRestartGameDialog()}>
                                    Restart game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    /**
     * Renders the match live scoring
     *
     * @param match
     * @returns {*}
     */
    renderLiveScoring(match) {
        return (
            <div>
                <span>{match.server_data.CT.team_name} (CT) v/s {match.server_data.T.team_name} (T) ({match.server_data.match.CT} / {match.server_data.match.T})</span><br/>
                <br/>
                <h5>CT ({match.server_data.CT.team_name} - {match.server_data.match.CT})</h5>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Player</th>
                            <th>K</th>
                            <th>A</th>
                            <th>D</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match.server_data.CT.players.map((player, index) => (
                            <tr key={index}>
                                <td>{player.name}</td>
                                <td>{player.kills}</td>
                                <td>{player.assists}</td>
                                <td>{player.deaths}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br/>
                <h5>T ({match.server_data.T.team_name} - {match.server_data.match.T})</h5>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Player</th>
                            <th>K</th>
                            <th>A</th>
                            <th>D</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match.server_data.T.players.map((player, index) => (
                            <tr key={index}>
                                <td>{player.name}</td>
                                <td>{player.kills}</td>
                                <td>{player.assists}</td>
                                <td>{player.deaths}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('servers,matches,maps')(Detail);
