import {h, Component} from 'preact';
import Socket from "../modules/socket";

export default class Servers extends Component {
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
                <h3>Servers</h3>
                <div className="table-responsive">
                    <table id="view-table" className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Server</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servers.map((server, index) => (
                                <tr key={index}>
                                    <td>{`${server.ip}:${server.port}`}</td>
                                    <td><span className="badge badge-success">Available</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
