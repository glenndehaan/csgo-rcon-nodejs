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
            connected: false
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
                    {this.state.connected && this.mainRender()}
                </div>
            </div>
        );
    }

    /**
     * Renders the main app when connection is ready
     *
     * @return {*}
     */
    mainRender() {
        return (
            <Router>
                <Home path="/"/>
                <Create path="/match/create"/>
                <Detail path="/match/:id"/>
            </Router>
        )
    }
}

render(<App/>, document.body);
