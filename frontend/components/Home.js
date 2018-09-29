import {h, Component} from 'preact';
import Socket from "../modules/socket";

export default class Home extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches
        };
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
     * Converts the status code to a string
     *
     * @param statusCode
     * @return {string}
     */
    statusResolver(statusCode) {
        if (statusCode === 0) {
            return "Match not started";
        }

        if (statusCode === 1) {
            return "Match running";
        }

        if (statusCode === 2) {
            return "Match ended";
        }

        return "Unknown Status";
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Matches</h3>

                <div className="table-responsive">
                    <table id="view-table" className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Server</th>
                                <th>Map</th>
                                <th>Team 1</th>
                                <th>Team 2</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.matches.map((match, index) => (
                                <tr key={index}>
                                    <td>{match.server}</td>
                                    <td>{match.map}</td>
                                    <td>{match.team1.name}</td>
                                    <td>{match.team2.name}</td>
                                    <td>{`${this.statusResolver(match.status)} (${match.status})`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
