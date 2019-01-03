import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import systemNotification from '../../modules/systemNotification';

import Home from '../icons/Home';
import Add from '../icons/Add';
import Servers from '../icons/Servers';
import Settings from '../icons/Settings';
import Notification from '../icons/Notification';
import {connect} from "unistore/preact";

class Header extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            connection: {
                className: "text-danger",
                text: "Disconnected"
            },
            notificationEnabled: systemNotification.currentPermissionStatus()
        };

        this.settings = null;

        window.events.on('router', (e) => {
            if(e.route !== "/settings") {
                this.settings.classList.remove("active");
            }
        });
    }

    /**
     * Function when component mounts
     */
    componentDidMount() {
        this.updateConnectionStatus();
    }

    /**
     * Function when component updates
     *
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.connected !== this.props.connected || prevProps.reconnecting !== this.props.reconnecting || prevProps.lang !== this.props.lang) {
            this.updateConnectionStatus();
        }
    }

    /**
     * Function to update the connection status
     */
    updateConnectionStatus() {
        if (this.props.connected && !this.props.reconnecting) {
            this.setState({
                connection: {
                    className: "text-success",
                    text: this.props.lang.general.header.connected
                }
            });
        }

        if (this.props.connected && this.props.reconnecting) {
            this.setState({
                connection: {
                    className: "text-warning",
                    text: this.props.lang.general.header.reconnecting
                }
            });
        }

        if (!this.props.connected && !this.props.reconnecting) {
            this.setState({
                connection: {
                    className: "text-danger",
                    text: this.props.lang.general.header.disconnected
                }
            });
        }
    }

    /**
     * Enables or disables the notifications
     */
    toggleNotification() {
        systemNotification.toggleNotifications((status) => {
            this.setState({
                notificationEnabled: status
            })
        })
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark">
                <Link href="/" className="navbar-brand d-none d-sm-block" title="Home / Logo">CSGO Remote</Link>
                <ul className="navbar-nav">
                    <li className="nav-item home-icon">
                        <Link href="/" activeClassName="active" className="nav-link" title={this.props.lang.general.header.links.home}>
                            <Home/>
                        </Link>
                    </li>
                    <li className="nav-item servers-icon">
                        <Link href="/servers" activeClassName="active" className="nav-link" title={this.props.lang.general.header.links.serverOverview}>
                            <Servers/>
                        </Link>
                    </li>
                    <li className="nav-item add-icon">
                        <Link href="/match/create" activeClassName="active" className="nav-link" title={this.props.lang.general.header.links.createMatch}>
                            <Add/>
                        </Link>
                    </li>
                    <li className="nav-item settings-icon">
                        <a href="/settings" className={`nav-link ${window.location.pathname === "/settings" ? 'active' : ''}`} ref={c => this.settings = c} title={this.props.lang.general.header.links.settings} native>
                            <Settings/>
                        </a>
                    </li>
                    <li className="nav-item notification-icon">
                        <div className="nav-link" onClick={() => this.toggleNotification()}>
                            <Notification enabled={this.state.notificationEnabled}/>
                        </div>
                    </li>
                </ul>
                <span className={`navbar-text ml-auto ${this.state.connection.className}`}>
                    {this.state.connection.text}
                </span>
            </nav>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(Header);
