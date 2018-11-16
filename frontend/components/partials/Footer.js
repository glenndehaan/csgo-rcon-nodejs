import {h, Component} from 'preact';

export default class Footer extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            loadTime: 0.00
        }
    }

    componentDidMount() {
        const loadTime = (Date.now() - window.loadTime) / 1000;

        this.setState({
            loadTime: loadTime.toFixed(2)
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
                    <span className="text">Loaded in: {this.state.loadTime} seconds | <a href="https://github.com/glenndehaan/csgo-rcon-nodejs" target="_blank" rel="noopener noreferrer" native>View on GitHub</a></span>
                </div>
            </footer>
        );
    }
}
