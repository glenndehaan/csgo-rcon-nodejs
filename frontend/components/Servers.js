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
                {this.state.servers.map((server, index) => (
                    <div className="server" key={index}>
                        {server.ip}:{server.port}&nbsp;&nbsp;
                        <span className="badge badge-success">Available</span><br/>
                    </div>
                ))}
            </div>
        );
    }
}
