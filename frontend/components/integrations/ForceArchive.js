import {h, Component} from 'preact';
import { connect } from "unistore/preact";

import Socket from "../../modules/socket";
import {route} from "preact-router";

class ForceArchive extends Component {
    /**
     * Send the request to the socket to start archiving the selected match
     *
     * @param index
     */
    archive(index) {
        Socket.send("integrations_force_archive", {
            id: index
        });

        window.events.emit("notification", {
            title: "Force archiving match...",
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
                <h6>{this.props.lang.settings.forceArchive.title}</h6>
                <span>{this.props.lang.settings.forceArchive.description}</span><br/>
                <br/>
                <ul className="list-group">
                    {this.props.matches.map((match, index) => {
                        if(match.status < 100) {
                            return (
                                <li key={index} className="list-group-item">
                                    <span>{match.team1.name} v/s {match.team2.name}</span>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail float-right m-0' onClick={() => this.archive(index)}>
                                        {this.props.lang.settings.forceArchive.archive}
                                    </button>
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('matches,lang')(ForceArchive);
