import {h, Component} from 'preact';
import { Link } from 'preact-router/match';
import { connect } from "unistore/preact";

import {checkServerAvailability} from "../utils/Arrays";

class Servers extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            availability: []
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `${this.props.lang.servers.title} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            },
            {
                "name": this.props.lang.servers.title,
                "url": false
            }
        ]);

        this.checkAvailability();
    }

    /**
     * Runs when the component updates
     *
     * @param previousProps
     */
    componentDidUpdate(previousProps) {
        if(previousProps !== this.props) {
            this.checkAvailability();
        }
    }

    /**
     * Checks if a servers are available
     */
    checkAvailability() {
        const availability = [];

        for(let item = 0; item < this.props.servers.length; item++) {
            const server = this.props.servers[item];
            const available = checkServerAvailability(`${server.ip}:${server.port}`, this.props.matches);

            availability.push({
                ip: server.ip,
                port: server.port,
                available: available === false ? this.props.lang.servers.available : (<span>{this.props.lang.servers.matchIsRunning}: <Link href={`/match/${available.id}`}>{available.team1.name} v/s {available.team2.name}</Link></span>),
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
                <h3>{this.props.lang.servers.subtitle}</h3>
                <div className="table-responsive">
                    <table id="view-table" className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>{this.props.lang.servers.table.server}</th>
                                <th>{this.props.lang.servers.table.status}</th>
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

/**
 * Connect the store to the component
 */
export default connect('servers,matches,lang')(Servers);
