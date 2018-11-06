import {h, Component} from 'preact';
import { route } from 'preact-router';
import Socket from "../modules/socket";

import {statusResolver} from "../utils/Strings";
import {findByIdInObjectArray} from "../utils/Arrays";
import Alert from "./partials/Alert";

export default class Detail extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches,
            maps: Socket.data.maps,
            match: false,
            showDialog: false
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
        Socket.on("update", (data) => this.onUpdate(data));

        this.setState({
            match: findByIdInObjectArray(Socket.data.matches, this.props.id)
        });

        if(this.state.match === false) {
            route('/');
        }
        console.log('this.state.match', this.state.match);
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("update", (data) => this.onUpdate(data));
    }

    /**
     * Updates the state based on data from the socket
     *
     * @param data
     */
    onUpdate(data) {
        console.log('dataUpdate', data);
        this.setState({
            servers: data.servers,
            matches: data.matches,
            maps: data.maps,
            match: findByIdInObjectArray(data.matches, this.props.id)
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
    showRestartGameDialog() {
        this.setState({
            showDialog: true
        });
    }

    /**
     * Hide the restart game dialog
     */
    closeRestartGameDialog() {
        this.setState({
            showDialog: false
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        if(this.state.match) {
            return (
                <div className="starter-template">
                    {this.state.showDialog ? <Alert yes={() => this.restartGame()} no={() => this.closeRestartGameDialog()} title="Restart game?" body="Warning! This will set all scores to 0 and restart the complete match!"/> : null}
                    <h3>Match {this.state.match.team1.name} v/s {this.state.match.team2.name}</h3>
                    <div className="row">
                        <div className="col-md-8">
                            <h4>Match details</h4>
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
                            Current match status: {`${statusResolver(this.state.match.status)} (${this.state.match.status})`}
                        </div>
                        <div className="col-md-4">
                            <h4>Match controls</h4>
                            <div>
                                <button type='button' className='btn btn-sm btn-success btn-detail' onClick={() => this.startKnife()}>
                                    Start knife round
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-success btn-detail' onClick={() => this.startMatch()}>
                                    Start match
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' onClick={() => this.endMatch()}>
                                    End Match & Restore Server
                                </button>
                                <br/>
                            </div><br/>
                            <h4>Server controls</h4>
                            <div>
                                <div className="btn-group" role="group">
                                    <button type='button' className='btn btn-sm btn-success btn-detail' onClick={() => this.resumeGame()}>
                                        Resume game
                                    </button>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail' onClick={() => this.pauseGame()}>
                                        Pause game
                                    </button>
                                </div>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail' onClick={() => this.switchTeamSides()}>
                                    Switch team sides
                                </button>
                                <br/>
                                <select name="map" id="map" title="map" className="form-control" ref={c => this.fields.map = c}>
                                    <option selected disabled value="false">Select map</option>
                                    {this.state.maps.map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))}
                                </select>
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' onClick={() => this.switchMap()}>
                                    Switch map
                                </button>
                                <br/>
                                <input type="text" className="form-control" name="message" id="message" title="message" ref={c => this.fields.message = c} />
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail' onClick={() => this.sendMessage()}>
                                    Say
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-danger btn-detail' onClick={() => this.showRestartGameDialog()}>
                                    Restart game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
