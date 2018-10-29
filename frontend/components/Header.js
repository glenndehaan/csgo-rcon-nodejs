import {h, Component} from 'preact';
import { Link } from 'preact-router/match';
import Home from './icons/Home';
import Add from './icons/Add';
import Settings from './icons/Settings';

export default class Header extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            connection: {
                className: "text-danger",
                text: "Disconnected"
            }
        };
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
        if(prevProps.connected !== this.props.connected || prevProps.reconnecting !== this.props.reconnecting) {
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
                    text: "Connected"
                }
            });
        }

        if (this.props.connected && this.props.reconnecting) {
            this.setState({
                connection: {
                    className: "text-warning",
                    text: "Reconnecting..."
                }
            });
        }

        if (!this.props.connected && !this.props.reconnecting) {
            this.setState({
                connection: {
                    className: "text-danger",
                    text: "Disconnected"
                }
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark">
                <Link href="/" className="navbar-brand" title="Home / Logo">CSGO Remote</Link>
                <ul className="navbar-nav">
                    <li className="nav-item home-icon">
                        <Link href="/" activeClassName="active" className="nav-link" title="Home">
                            <Home/>
                        </Link>
                    </li>
                    <li className="nav-item add-icon">
                        <Link href="/match/create" activeClassName="active" className="nav-link" title="Create match">
                            <Add/>
                        </Link>
                    </li>
                    <li className="nav-item settings-icon">
                        <a href="/settings" className={`nav-link ${window.location.pathname === "/settings" ? 'active': ''}`} title="Settings" native>
                            <Settings/>
                        </a>
                    </li>
                </ul>
                <span className={`navbar-text ml-auto ${this.state.connection.className}`}>
                    {this.state.connection.text}
                </span>
            </nav>
        );
    }
}
