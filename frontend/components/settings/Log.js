import {h, Component} from 'preact';
import {connect} from "unistore/preact";

class Log extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.updateGeneralPageData();
    }

    /**
     * Runs when the component updates
     */
    componentDidUpdate() {
        this.updateGeneralPageData();
    }

    /**
     * Updates some general page data
     */
    updateGeneralPageData() {
        document.title = `Server Logs | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            },
            {
                "name": this.props.lang.settings.title,
                "url": "/settings"
            },
            {
                "name": this.props.lang.settings.log.title,
                "url": false
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
                <h3>{this.props.lang.settings.log.title}</h3>
                <div className="logs">
                    {this.props.logs.map((log, key) => (
                        <div key={key}>{log}<br/></div>
                    ))}
                </div>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang,logs')(Log);
