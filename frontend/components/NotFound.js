import {h, Component} from 'preact';

export default class NotFound extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `Not Found | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
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
                <h3>Not Found</h3>
                <span>
                    Use the menu above to navigate to another page.
                </span>
            </div>
        );
    }
}
