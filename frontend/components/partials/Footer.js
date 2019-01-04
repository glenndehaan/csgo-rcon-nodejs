import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import {connect} from "unistore/preact";
import storage from "../../modules/storage";
import language from "../../modules/language";

import Language from "../icons/Language";
import GB from "../flags/GB";
import FR from "../flags/FR";
import DE from "../flags/DE";
import NL from "../flags/NL";

class Footer extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            loadTime: 0.00,
            langToggleOpen: false,
            currentLang: storage.get("lang")
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
     * Switches the language
     *
     * @param lang
     */
    switchLang(lang) {
        language.set(lang);

        this.setState({
            langToggleOpen: false,
            currentLang: lang
        });
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
                    <div className={`btn-group dropup ${this.state.langToggleOpen === true && 'show'}`}>
                        <button onClick={() => this.toggleButton()} title="language" type="button" className="btn btn-sm btn-secondary dropdown-toggle language-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <Language/>
                        </button>
                        <div className={`dropdown-menu ${this.state.langToggleOpen === true && 'show'}`}>
                            <a className={`dropdown-item ${this.state.currentLang === 'en' && 'active'}`} onClick={() => this.switchLang("en")}><GB/></a>
                            <a className={`dropdown-item ${this.state.currentLang === 'fr' && 'active'}`} onClick={() => this.switchLang("fr")}><FR/></a>
                            <a className={`dropdown-item ${this.state.currentLang === 'de' && 'active'}`} onClick={() => this.switchLang("de")}><DE/></a>
                            <a className={`dropdown-item ${this.state.currentLang === 'nl' && 'active'}`} onClick={() => this.switchLang("nl")}><NL/></a>
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
