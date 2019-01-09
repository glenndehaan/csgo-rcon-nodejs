import {h, Component} from 'preact';
import fetch from 'unfetch';
import {connect} from "unistore/preact";

class About extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            currentCommit: window.expressConfig.version,
            latestCommit: false,
            dev: process.env.NODE_ENV !== 'production'
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.updateGeneralPageData();
        this.checkCurrentVersion();
    }

    /**
     * Runs when component updates
     */
    componentDidUpdate() {
        this.updateGeneralPageData();
    }

    /**
     * Updates some general page data
     */
    updateGeneralPageData() {
        document.title = `${this.props.lang.about.title} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            },
            {
                "name": this.props.lang.about.title,
                "url": false
            }
        ]);
    }

    /**
     * Fetch the latest version from GitHub
     */
    checkCurrentVersion() {
        //todo https://api.github.com/repos/glenndehaan/csgo-rcon-nodejs/releases
        fetch('https://api.github.com/repos/glenndehaan/csgo-rcon-nodejs/commits')
            .then(r => r.json())
            .then(data => {
                if(data.length > 0) {
                    if(data[0].sha) {
                        this.setState({
                            latestCommit: data[0].sha
                        })
                    }
                }
            })
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>{this.props.lang.about.subtitle}</h3>
                {this.state.dev && <div className="text-warning">Warning: <strong className="text-body">{this.props.lang.about.devWarning}</strong></div>}
                {this.state.currentCommit !== this.state.latestCommit && <div className="text-warning">Warning: <strong className="text-body">{this.props.lang.about.oldWarning}</strong></div>}
                {(this.state.currentCommit !== this.state.latestCommit || this.state.dev) && <br/>}
                <div>
                    <h4>{this.props.lang.about.descriptionTitle}</h4>
                    {this.props.lang.about.description}<br/>

                    <br/>

                    <h4>{this.props.lang.about.version}</h4>
                    {this.props.lang.about.currentVersion}: {this.state.dev ? '__DEV__' : this.state.currentCommit}<br/>
                    {this.props.lang.about.latestVersion}: {!this.state.latestCommit ? 'Checking...' : this.state.latestCommit}<br/>

                    <br/>

                    <h4>{this.props.lang.about.contributors}</h4>
                    glenndehaan (<a href="https://github.com/glenndehaan" target="_blank" rel="noopener noreferrer" native>GitHub</a>)<br/>
                    ChrisEKN (<a href="https://github.com/ChrisEKN" target="_blank" rel="noopener noreferrer" native>GitHub</a>)<br/>

                    <br/>

                    <h4>{this.props.lang.about.project}</h4>
                    GitHub: <a href="https://github.com/glenndehaan/csgo-rcon-nodejs" target="_blank" rel="noopener noreferrer" native>https://github.com/glenndehaan/csgo-rcon-nodejs</a><br/>
                    Star: <iframe src="https://ghbtns.com/github-btn.html?user=glenndehaan&repo=csgo-rcon-nodejs&type=star&count=true&size=small" frameBorder="0" scrolling="0" width="100px" height="20px" /><br/>
                    Fork: <iframe src="https://ghbtns.com/github-btn.html?user=glenndehaan&repo=csgo-rcon-nodejs&type=fork&count=true&size=small" frameBorder="0" scrolling="0" width="100px" height="20px" /><br/>

                    <br/>

                    <h4>{this.props.lang.about.backendStructure}</h4>
                    - NodeJS<br/>
                    - Simple Node Logger<br/>
                    - srcds-rcon<br/>
                    - Json DB<br/>
                    - Express<br/>
                    - Express-WS<br/>

                    <br/>

                    <h4>{this.props.lang.about.frontendStructure}</h4>
                    - Webpack<br/>
                    - Preact<br/>
                    - Preact Router<br/>
                    - Bootstrap<br/>
                    - Sass<br/>
                    - Sockette<br/>
                </div>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(About);
