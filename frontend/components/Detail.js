import {h, Component} from 'preact';
import { route } from 'preact-router';
import Socket from "../modules/socket";

import {statusResolver} from "../utils/Strings";
import {findByIdInObjectArray} from "../utils/Arrays";

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
            match: false
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
        this.setState({
            servers: data.servers,
            matches: data.matches,
            maps: data.maps
        });
    }

    /**
     * Starts the match
     */
    startMatch() {
        Socket.send("start_match", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Ends the match
     */
    endMatch() {
        Socket.send("end_match", {
            id: parseInt(this.state.match.index)
        });
    }

    /**
     * Disconnects the CSGO server
     */
    disconnectServer() {
        Socket.send("disconnect_server", {
            id: parseInt(this.state.match.index)
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
                            Main CSGO Config: {this.state.match.match_config}<br/>
                            Current match status: {`${statusResolver(this.state.match.status)} (${this.state.match.status})`}
                        </div>
                        <div className="col-md-4">
                            <h4>Match controls</h4>
                            <div>
                                <button type='button' className='btn btn-sm btn-success btn-detail' onClick={() => this.startMatch()}>
                                    Connect Server & Start Match
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-warning btn-detail' onClick={() => this.endMatch()}>
                                    End Match & Restore Server
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-danger btn-detail' onClick={() => this.disconnectServer()}>
                                    Disconnect Server
                                </button>
                                <br/>
                            </div>
                            <h4>Server controls</h4>
                            <div>
                                <div className="btn-group" role="group">
                                    <button type='button' className='btn btn-sm btn-success btn-detail'>
                                        Resume game
                                    </button>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail'>
                                        Pause game
                                    </button>
                                </div>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail'>
                                    Switch team sides
                                </button>
                                <br/>
                                <select name="map" id="map" title="map">
                                    <option selected disabled value="false">Select map</option>
                                    {this.state.maps.map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))}
                                </select>
                                &nbsp;
                                <button type='button' className='btn btn-sm btn-primary btn-detail'>
                                    Switch map
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail'>
                                    Restart round
                                </button>
                                <br/>
                                <button type='button' className='btn btn-sm btn-primary btn-detail'>
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
