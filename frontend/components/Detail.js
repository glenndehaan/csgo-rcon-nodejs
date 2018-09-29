import {h, Component} from 'preact';
import Socket from "../modules/socket";

export default class Detail extends Component {
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
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Match details</h3>
            </div>
        );
    }
}
