import {h, Component, render} from 'preact';
import Router from 'preact-router';
import mitt from 'mitt';
import Socket from './modules/socket';

import Header from "./components/partials/Header";
import Home from './components/Home';
import Create from './components/Create';
import Edit from './components/Edit';
import Detail from './components/Detail';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

import Notification from './components/partials/Notification';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            connected: false,
            reconnecting: false
        };

        Socket.initialize(window.location.host, () => this.connected(), () => this.disconnected() , () => this.reconnecting());
        window.events = mitt();
    }

    /**
     * Function when socket connects
     */
    connected() {
        this.setState({
            connected: true,
            reconnecting: false
        });
    }

    /**
     * Function when socket disconnects
     */
    disconnected() {
        this.setState({
            connected: false,
            reconnecting: false
        });
    }

    /**
     * Function when the socket is reconnecting
     */
    reconnecting() {
        this.setState({
            reconnecting: true
        });
    }

    /**
     * Catches the router events
     *
     * @param e
     */
    routerUpdate(e) {
        window.events.emit("router", {
            route: e.url
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
                <Header connected={this.state.connected} reconnecting={this.state.reconnecting}/>
                <div className="container">
                    <Notification/>
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
            <Router onChange={this.routerUpdate}>
                <Home path="/"/>
                <Create path="/match/create"/>
                <Detail path="/match/:id"/>
                <Edit path="/match/:id/edit"/>
                <Settings path="/settings"/>
                <NotFound default/>
            </Router>
        )
    }
}

render(<App/>, document.body);
require('preact/debug');
