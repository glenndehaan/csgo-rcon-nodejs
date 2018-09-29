import {h, Component, render} from 'preact';
import Router from 'preact-router';
import Socket from './modules/socket';

import Header from "./components/Header";
import Home from './components/Home'
import Create from './components/Create'
import Detail from './components/Detail'

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
                    <Router>
                        <Home path="/"/>
                        <Create path="/match/create"/>
                        <Detail path="/match/:id"/>
                    </Router>
                </div>
            </div>
        );
    }
}

render(<App/>, document.body);
