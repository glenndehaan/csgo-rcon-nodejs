import {h, Component} from 'preact';
import {Link} from 'preact-router/match';

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
                    <span className="text">Loaded in: {this.state.loadTime} seconds | <Link href="/about">About</Link></span>
                </div>
            </footer>
        );
    }
}
