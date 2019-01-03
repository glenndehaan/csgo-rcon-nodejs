import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import {connect} from "unistore/preact";

import Language from "../icons/Language";

class Footer extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            loadTime: 0.00,
            langToggleOpen: false
        }
    }

    /**
     * Runs then the component mounts
     */
    componentDidMount() {
        const loadTime = (Date.now() - window.loadTime) / 1000;

        this.setState({
            loadTime: loadTime.toFixed(2)
        });
    }

    /**
     * Toggles the lang dropdown
     */
    toggleButton() {
        if(this.state.langToggleOpen) {
            this.setState({
                langToggleOpen: false
            });
        } else {
            this.setState({
                langToggleOpen: true
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
            <footer className="footer">
                <div className="container">
                    <span className="text">{this.props.lang.general.footer.loadedIn}: {this.state.loadTime} {this.props.lang.general.footer.seconds} | <Link href="/about">{this.props.lang.general.footer.about}</Link></span>
                    <div className={`btn-group dropup ${this.state.langToggleOpen ? 'show' : ''}`} onClick={() => this.toggleButton()}>
                        <button type="button" className="btn btn-sm btn-secondary dropdown-toggle language-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <Language/>
                        </button>
                        <div className={`dropdown-menu ${this.state.langToggleOpen ? 'show' : ''}`}>
                            <a className="dropdown-item" href="#" native>EN</a>
                            <a className="dropdown-item" href="#" native>FR</a>
                            <a className="dropdown-item" href="#" native>DE</a>
                            <a className="dropdown-item" href="#" native>NL</a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(Footer);
