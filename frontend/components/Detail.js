import {h, Component} from 'preact';
import { route } from 'preact-router';
import { connect } from "unistore/preact";
import {Link} from "preact-router/match";

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

        this.liveScoringTabs = {
            score: null,
            killfeed: null
        };

        this.liveScoringContent = {
            score: null,
            killfeed: null
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

        this.updateGeneralPageData();
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

        this.updateGeneralPageData();
    }

    /**
     * Updates some general page data
     */
    updateGeneralPageData() {
        document.title = `${this.props.lang.detail.title} ${this.state.match.team1.name} v/s ${this.state.match.team2.name} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            },
            {
                "name": `${this.props.lang.detail.title} ${this.state.match.team1.name} v/s ${this.state.match.team2.name}`,
                "url": false
            }
        ]);
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
     * Connects steam to a CS:GO server
     */
    connectClientServer(e, server) {
        e.preventDefault();
        window.location = server;
    }

    /**
     * Toggles the classes for the livescoring subtabs
     *
     * @param tabName
     */
    toggleLiveScoringTab(tabName) {
        const keys = Object.keys(this.liveScoringContent);

        for(let item = 0; item < keys.length; item++) {
            this.liveScoringContent[keys[item]].classList.remove("active", "show");
            this.liveScoringTabs[keys[item]].classList.remove("active", "show");
        }

        this.liveScoringContent[tabName].classList.add("active", "show");
        this.liveScoringTabs[tabName].classList.add("active", "show");
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
                    {this.state.showConnectDialog ? <Alert yes={() => this.connectServer()} no={() => this.closeConnectDialog()} title={this.props.lang.detail.connectServerAlert.title} body={this.props.lang.detail.connectServerAlert.body}/> : null}
                    {this.state.showRestartDialog ? <Alert yes={() => this.restartGame()} no={() => this.closeRestartGameDialog()} title={this.props.lang.detail.restartGameAlert.title} body={this.props.lang.detail.restartGameAlert.body}/> : null}
                    <h3>{this.props.lang.detail.title} {this.state.match.team1.name} v/s {this.state.match.team2.name}</h3>
                    <div className="row">
                        <div className="col-md-8">
                            <h4>{this.props.lang.detail.subtitle}</h4>
                            <div>
                                {this.props.lang.detail.matchGroup}: {this.state.match.match_group}<br/>
                                {this.props.lang.detail.matchType}: Bo{this.state.match.max_games}<br/>
                                {this.props.lang.detail.gameMode}: {this.state.match.game_mode.charAt(0).toUpperCase() + this.state.match.game_mode.slice(1)}<br/>
                                <br/>
                                {this.props.lang.detail.team1Name}: {this.state.match.team1.name}<br/>
                                {this.props.lang.detail.team1Country}: {this.state.match.team1.country}<br/>
                                <br/>
                                {this.props.lang.detail.team2Name}: {this.state.match.team2.name}<br/>
                                {this.props.lang.detail.team2Country}: {this.state.match.team2.country}<br/>
                                <br/>
                                {this.props.lang.detail.server}: <Link href="#" native onClick={(e) => this.connectClientServer(e, `steam://connect/${this.state.match.server.split(":")[0]}/${this.state.match.server.split(":")[1]}`)}>{this.state.match.server}</Link><br/>
                                {this.props.lang.detail.map}: {this.state.match.map}<br/>
                                {this.props.lang.detail.csgoKnifeConfig}: {this.state.match.knife_config}<br/>
                                {this.props.lang.detail.csgoMainConfig}: {this.state.match.match_config}<br/>
                                {this.props.lang.detail.currentMatchStatus}: {`${statusResolver(this.state.match.status)} (${this.state.match.status})`}<br/>
                            </div><br/>
                            <h4>{this.props.lang.detail.liveScoring}</h4>
                            {!this.state.match.server_data && <span className="status-error">{this.props.lang.detail.noScoresAvailable}</span>}
                            {this.state.match.server_data && this.renderLiveScoring(this.state.match)}
                        </div>
                        <div className="col-md-4 mt-5 mt-md-0">
                            <h4>{this.props.lang.detail.matchControls}</h4>
                            {this.state.match.status >= 99 && <span className="status-error">{this.props.lang.detail.matchControlsLocked}<br/>{this.props.lang.detail.matchControlsLockedReason1}</span>}
                            {this.state.match.status < 99 && !this.state.serverAvailable && <span className="status-error">{this.props.lang.detail.matchControlsLocked}<br/>{this.props.lang.detail.matchControlsLockedReason2}</span>}
                            <div>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status >= 99 || !this.state.serverAvailable} onClick={() => this.showConnectDialog()}>
                                    {this.props.lang.detail.connectServer}
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.startWarmup()}>
                                    {this.props.lang.detail.startWarmup}
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99 || this.state.match.game_mode === "dangerzone"} onClick={() => this.startKnife()}>
                                    {this.props.lang.detail.startKnifeRound}
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.startMatch()}>
                                    {this.props.lang.detail.startMatch}
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.endMatch()}>
                                    {this.props.lang.detail.endMatch}
                                </button>
                                <br/>
                            </div><br/>
                            <h4>{this.props.lang.detail.serverControls}</h4>
                            {this.state.match.status === 0 && <span className="status-error">{this.props.lang.detail.serverControlsLocked}<br/>{this.props.lang.detail.serverControlsLockedReason1}</span>}
                            {this.state.match.status >= 99 && <span className="status-error">{this.props.lang.detail.serverControlsLocked}<br/>{this.props.lang.detail.serverControlsLockedReason2}</span>}
                            <div>
                                <div className="btn-group" role="group">
                                    <button type='button' className='btn btn-sm btn-success btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.resumeGame()}>
                                        {this.props.lang.detail.resumeGame}
                                    </button>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.pauseGame()}>
                                        {this.props.lang.detail.pauseGame}
                                    </button>
                                </div>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.switchTeamSides()}>
                                    {this.props.lang.detail.switchTeamSides}
                                </button>
                                <br/>
                                <select name="map" id="map" title="map" className="form-control" disabled={this.state.match.status === 0 || this.state.match.status >= 99} ref={c => this.fields.map = c}>
                                    <option selected disabled value="false">{this.props.lang.detail.selectMap}</option>
                                    {this.props.maps[this.state.match.game_mode].map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))}
                                </select>
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.switchMap()}>
                                    {this.props.lang.detail.switchMap}
                                </button>
                                <br/>
                                <input type="text" className="form-control" name="message" id="message" title="message" disabled={this.state.match.status === 0 || this.state.match.status >= 99} ref={c => this.fields.message = c} />
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.sendMessage()}>
                                    {this.props.lang.detail.say}
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-danger btn-detail' disabled={this.state.match.status === 0 || this.state.match.status >= 99} onClick={() => this.showRestartGameDialog()}>
                                    {this.props.lang.detail.restartGame}
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
                <div className="nav nav-tabs">
                    <a className="nav-item nav-link active show" href="#score" ref={c => this.liveScoringTabs.score = c} onClick={() => this.toggleLiveScoringTab("score")}>Score</a>
                    <a className="nav-item nav-link" href="#killfeed" ref={c => this.liveScoringTabs.killfeed = c} onClick={() => this.toggleLiveScoringTab("killfeed")}>Killfeed</a>
                </div>
                <div className="tab-content">
                    <div className="tab-pane fade active show" ref={c => this.liveScoringContent.score = c}>
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
                    <div className="tab-pane fade" ref={c => this.liveScoringContent.killfeed = c}>
                        Hey nothing here yet!
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('servers,matches,maps,lang')(Detail);
