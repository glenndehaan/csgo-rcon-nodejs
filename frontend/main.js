import {h, Component, render} from 'preact';
import Socket from './modules/socket';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            server: null,
            nickname: null,
            informationReady: false,
            connected: false,
            connectionError: false
        };
    }

    /**
     * Function when socket connects
     */
    connected() {
        this.setState({
            connected: true
        });
    }

    /**
     * Function when socket disconnects
     */
    disconnected() {
        this.setState({
            connected: false
        });
    }

    /**
     * Function when connect form is submit
     */
    connectSubmit(server, nickname) {
        this.setState({
            server,
            nickname
        });

        Socket.initialize(server, nickname, () => this.connected(), () => this.disconnected());
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                Hoi
            </div>
        );
    }
}

render(<App/>, document.body);
