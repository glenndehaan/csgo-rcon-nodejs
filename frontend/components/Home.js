import {h, Component} from 'preact';
import { Link } from 'preact-router/match';

import Details from "./icons/Details";

import Socket from "../modules/socket";
import {statusResolver} from "../utils/Strings";

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
        Socket.on("update", (data) => this.onUpdate(data));
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
            matches: data.matches
        });
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
                                    <td>{`${statusResolver(match.status)} (${match.status})`}</td>
                                    <td><Link href={`/match/${match.id}`} title="Match details"><Details/></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
