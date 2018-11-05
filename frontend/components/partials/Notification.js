import {h, Component} from 'preact';
import Close from "../icons/Close";

export default class Notification extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            notifications: []
        };

        window.events.on('notification', (e) => this.add(e.title, e.color));
    }

    /**
     * Add's a new notification
     *
     * @param title
     * @param color
     */
    add(title, color) {
        const tempState = this.state.notifications;
        const length = tempState.push({
            title,
            color
        });

        setTimeout(() => {
            this.close((length - 1));
        }, 5000);

        this.setState({
            notifications: tempState
        });
    }

    /**
     * Closes a notification
     *
     * @param index
     */
    close(index) {
        const tempState = this.state.notifications;
        delete tempState[index];

        this.setState({
            notifications: tempState
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="notifications">
                {this.state.notifications.map((notification, index) => this.renderNotification(notification, index))}
            </div>
        );
    }

    /**
     * Renders a single notification
     *
     * @param notification
     * @param index
     * @return {*}
     */
    renderNotification(notification, index) {
        return (
            <div className={`alert alert-${notification.color}`} role="alert">
                {notification.title}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.close(index)}>
                    <Close/>
                </button>
            </div>
        );
    }
}
