import {h, Component} from 'preact';
import { Link } from 'preact-router/match';

export default class Header extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark">
                <Link href="/" className="navbar-brand">CSGO Remote</Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href="/" activeClassName="active" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/match/create" activeClassName="active" className="nav-link">Create Match</Link>
                    </li>
                </ul>
            </nav>
        );
    }
}
