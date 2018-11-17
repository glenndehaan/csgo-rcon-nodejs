import {h, Component} from 'preact';
import fetch from 'unfetch';

export default class About extends Component {
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
        document.title = `About | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "name": "About",
                "url": false
            }
        ]);

        this.checkCurrentVersion();
    }

    checkCurrentVersion() {
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
                <h3>About</h3>
                {this.state.dev && <div className="text-warning">Warning: <strong className="text-body">You are running a development version!!</strong></div>}
                {this.state.currentCommit !== this.state.latestCommit && <div className="text-warning">Warning: <strong className="text-body">You are running an older version!! Please update your version soon...</strong></div>}
                {(this.state.currentCommit !== this.state.latestCommit || this.state.dev) && <br/>}
                <div>
                    <h4>Description</h4>
                    A web panel to control a CS::GO server<br/>

                    <br/>

                    <h4>Version</h4>
                    Current version: {this.state.dev ? '__DEV__' : this.state.currentCommit}<br/>
                    Latest version: {!this.state.latestCommit ? 'Checking...' : this.state.latestCommit}<br/>

                    <br/>

                    <h4>Contributors</h4>
                    glenndehaan (<a href="https://github.com/glenndehaan" target="_blank" rel="noopener noreferrer" native>GitHub</a>)<br/>
                    ChrisEKN (<a href="https://github.com/ChrisEKN" target="_blank" rel="noopener noreferrer" native>GitHub</a>)<br/>

                    <br/>

                    <h4>Project</h4>
                    GitHub: <a href="https://github.com/glenndehaan/csgo-rcon-nodejs" target="_blank" rel="noopener noreferrer" native>https://github.com/glenndehaan/csgo-rcon-nodejs</a><br/>
                    Star: <iframe src="https://ghbtns.com/github-btn.html?user=glenndehaan&repo=csgo-rcon-nodejs&type=star&count=true&size=small" frameBorder="0" scrolling="0" width="100px" height="20px" /><br/>
                    Fork: <iframe src="https://ghbtns.com/github-btn.html?user=glenndehaan&repo=csgo-rcon-nodejs&type=fork&count=true&size=small" frameBorder="0" scrolling="0" width="100px" height="20px" /><br/>

                    <br/>

                    <h4>Backend structure</h4>
                    - NodeJS<br/>
                    - Simple Node Logger<br/>
                    - srcds-rcon<br/>
                    - Json DB<br/>
                    - Express<br/>
                    - Express-WS<br/>

                    <br/>

                    <h4>Frontend structure</h4>
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
