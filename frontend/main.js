import {h, Component, render} from 'preact';
import Router from 'preact-router';
import { Provider } from 'unistore/preact';
import mitt from 'mitt';
import Socket from './modules/socket';

import store from './modules/store';

import Header from "./components/partials/Header";
import Home from './components/Home';
import Servers from "./components/Servers";
import Create from './components/Create';
import Edit from './components/Edit';
import Detail from './components/Detail';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

import Notification from './components/partials/Notification';
import Breadcrumbs from "./components/partials/Breadcrumbs";
import Footer from "./components/partials/Footer";

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
                    <Breadcrumbs/>
                    {(this.state.connected && !this.state.reconnecting) && this.mainRender()}
                    {this.state.reconnecting && this.reconnectRender()}
                    {(!this.state.connected && !Socket.initialConnect) && this.errorRender()}
                </div>
                <Footer/>
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
                <Servers path="/servers"/>
                <Create path="/match/create"/>
                <Detail path="/match/:id"/>
                <Edit path="/match/:id/edit"/>
                <Settings path="/settings"/>
                <NotFound default/>
            </Router>
        )
    }

    /**
     * Renders the error message
     *
     * @return {*}
     */
    errorRender() {
        return (
            <div className="starter-template">
                <h3>Whoops!</h3>
                <div>
                    The connection to the server has been lost!<br/>
                    A reconnect attempt has been made but the server didn&apos;t respond in time.<br/>
                    Please try to refresh this page...
                </div>
            </div>
        )
    }

    /**
     * Renders the reconnecting message
     *
     * @return {*}
     */
    reconnectRender() {
        return (
            <div className="starter-template">
                <h3>Reconnecting!</h3>
                <div>
                    The connection to the server has been lost!<br/>
                    We are trying to reconnect to the server.<br/>
                    Please wait...
                </div>
            </div>
        )
    }
}

render(<Provider store={store}><App/></Provider>, document.body);
require('preact/debug');
