import {h, Component} from 'preact';

export default class NotFound extends Component {
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
