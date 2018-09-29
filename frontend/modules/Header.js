import {h, Component} from 'preact';
export default class Header extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (

            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="/">CSGO Rcon NodeJS</a>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/match/create">Create match</a>
                        </li>
                    </ul>
                </div>
            </nav>


        );
    }
}






