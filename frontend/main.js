import {h, Component, render} from 'preact';
import Router from 'preact-router';
import {connect, Provider} from 'unistore/preact';
import mitt from 'mitt';

import Socket from './modules/socket';
import store from './modules/store';
import language from './modules/language';

import Header from "./components/partials/Header";
import Home from './components/Home';
import Servers from "./components/Servers";
import Create from './components/Create';
import Edit from './components/Edit';
import Detail from './components/Detail';
import Settings from './components/Settings';
import Log from './components/settings/Log';
import NotFound from './components/NotFound';

import Notification from './components/partials/Notification';
import Breadcrumbs from "./components/partials/Breadcrumbs";
import Footer from "./components/partials/Footer";
import About from "./components/About";

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
        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';

        language.init();
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
                <Log path="/settings/log"/>
                <About path="/about"/>
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
                <h3>{this.props.lang.general.connection.error.title}</h3>
                <div>
                    {this.props.lang.general.connection.error.line1}<br/>
                    {this.props.lang.general.connection.error.line2}<br/>
                    {this.props.lang.general.connection.error.line3}
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
                <h3>{this.props.lang.general.connection.reconnecting.title}</h3>
                <div>
                    {this.props.lang.general.connection.reconnecting.line1}<br/>
                    {this.props.lang.general.connection.reconnecting.line2}<br/>
                    {this.props.lang.general.connection.reconnecting.line3}
                </div>
            </div>
        )
    }
}

const DataApp = connect('lang')(App);
render(<Provider store={store}><DataApp/></Provider>, document.body);
require('preact/debug');
