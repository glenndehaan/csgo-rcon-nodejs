import {h, Component} from 'preact';
import { Link } from 'preact-router/match';
import Socket from "../modules/socket";

import {checkServerAvailability} from "../utils/Arrays";

export default class Servers extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches,
            availability: []
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `Servers | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "name": "Servers",
                "url": false
            }
        ]);

        Socket.on("update", (data) => this.onUpdate(data));
        this.checkAvailability();
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

        this.checkAvailability();
    }

    /**
     * Checks if a servers are available
     */
    checkAvailability() {
        const availability = [];

        for(let item = 0; item < this.state.servers.length; item++) {
            const server = this.state.servers[item];
            const available = checkServerAvailability(`${server.ip}:${server.port}`, this.state.matches);

            availability.push({
                ip: server.ip,
                port: server.port,
                available: available === false ? "Available" : (<span>Match is running: <Link href={`/match/${available.id}`}>{available.team1.name} v/s {available.team2.name}</Link></span>),
                color: available === false ? "success" : "warning"
            });
        }

        this.setState({
            availability
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
                            {this.state.availability.map((server, index) => (
                                <tr key={index}>
                                    <td>{`${server.ip}:${server.port}`}</td>
                                    <td><span className={`badge badge-${server.color}`}>{server.available}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
