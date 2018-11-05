import {h, Component} from 'preact';

import Socket from "../../modules/socket";
import {route} from "preact-router";

export default class Archive extends Component {
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
                <h6>Archive</h6>
                <span>Click the archive button below to archive ended matches</span><br/>
                <br/>
                <button type='button' className='btn btn-sm btn-warning btn-detail' onClick={() => this.archive()}>
                    Archive
                </button>
            </div>
        );
    }
}
