import {h, Component} from 'preact';
import Socket from "../modules/socket";

export default class Create extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches,
            map: ""
        };

        this.serverField = null;
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        Socket.on("init", (data) => this.onUpdate(data));
        Socket.on("update", (data) => this.onUpdate(data));
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("init", (data) => this.onUpdate(data));
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
            matches: data.matches
        });
    }

    /**
     * Updated the map based on the selected server
     */
    updateMapField() {
        for(let item = 0; item < this.state.servers.length; item++) {
            if(this.serverField.value === (this.state.servers[item].ip + ":" + this.state.servers[item].port)) {
                this.setState({
                    map: this.state.servers[item].default_map
                });

                break;
            }
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Create new match</h3>

                <div className="table-responsive">
                    <form>
                        <h4>Team 1</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" name="team-name-1" id="team-name-1" title="team-name-1" /></td>
                                </tr>
                                <tr>
                                    <td>Country Code</td>
                                    <td><input type="text" name="team-country-1" id="team-country-1" title="team-country-1" /></td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Team 2</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" name="team-name-2" id="team-name-2" title="team-name-2" /></td>
                                </tr>
                                <tr>
                                    <td>Country Code</td>
                                    <td><input type="text" name="team-country-2" id="team-country-2" title="team-country-2" /></td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>General Match Settings</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Server</td>
                                    <td>
                                        <select title="server" name="server" id="server" onChange={() => this.updateMapField()} ref={c => this.serverField = c}>
                                            <option selected disabled value="false">Select a server</option>
                                            {this.state.servers.map((server, index) => (
                                                <option key={index} value={`${server.ip}:${server.port}`}>{`${server.ip}:${server.port}`}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Map</td>
                                    <td><input type="text" name="map" title="map" id="map" value={this.state.map} disabled/></td>
                                </tr>
                                <tr>
                                    <td>Main CSGO Config</td>
                                    <td>
                                        <select title="csgo-config" name="csgo-config" id="csgo-config">
                                            <option selected disabled value="false">Select a config</option>
                                            <option value="esl5v5">esl5v5</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><button type="button" className="btn btn-lg btn-success" id="submit">Create</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}
