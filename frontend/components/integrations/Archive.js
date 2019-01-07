import {h, Component} from 'preact';

import Socket from "../../modules/socket";
import {route} from "preact-router";
import {connect} from "unistore/preact";

class Archive extends Component {
    /**
     * Send the request to the socket to start archiving the completed matches
     */
    archive() {
        Socket.send("integrations_archive", {});

        window.events.emit("notification", {
            title: "Archiving ended matches...",
            color: "primary"
        });

        route('/');
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div>
                <h6>{this.props.lang.settings.archive.title}</h6>
                <span>{this.props.lang.settings.archive.description}</span><br/>
                <br/>
                <button type='button' className='btn btn-sm btn-warning btn-detail' onClick={() => this.archive()}>
                    {this.props.lang.settings.archive.archive}
                </button>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(Archive);
