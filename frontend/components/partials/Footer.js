import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import {connect} from "unistore/preact";

class Footer extends Component {
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
                    <span className="text">{this.props.lang.general.footer.loadedIn}: {this.state.loadTime} {this.props.lang.general.footer.seconds} | <Link href="/about">{this.props.lang.general.footer.about}</Link></span>
                </div>
            </footer>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(Footer);
