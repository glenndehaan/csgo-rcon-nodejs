import {h, Component, render} from 'preact';
import Socket from './modules/socket';

import Header from "./components/Header";
import Home from './components/Home'

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            connected: false,
            connectionError: false
        };

        Socket.initialize(window.location.host, () => this.connected(), () => this.disconnected());
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
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                <Header/>
                <div className="container">
                    <Home/>
                </div>
            </div>
        );
    }
}

render(<App/>, document.body);
