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
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <Link className="navbar-brand" href="/">CSGO Rcon NodeJS</Link>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link activeClassName="active" className="nav-link" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" className="nav-link" href="/match/create/">Create match</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
