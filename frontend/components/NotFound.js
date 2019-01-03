import {h, Component} from 'preact';
import {connect} from "unistore/preact";

class NotFound extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.updateGeneralPageData();
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
        document.title = `${this.props.lang.general.notFound.title} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            }
        ]);
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>{this.props.lang.general.notFound.subtitle}</h3>
                <span>
                    {this.props.lang.general.notFound.body}
                </span>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(NotFound);
