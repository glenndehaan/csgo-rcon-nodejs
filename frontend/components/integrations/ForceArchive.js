import {h, Component} from 'preact';

import Socket from "../../modules/socket";
import {route} from "preact-router";

export default class ForceArchive extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            matches: Socket.data.matches
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        Socket.on("update", (data) => this.onUpdate(data));
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("update", (data) => this.onUpdate(data));
    }

    /**
     * Updates the state based on data from the socket
     *
     * @param data
     */
    onUpdate(data) {
        console.log('dataUpdate', data);
        this.setState({
            matches: data.matches
        });
    }

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
                <h6>Force archive matches</h6>
                <span>Click the archive button below to force archive a match</span><br/>
                <br/>
                <ul className="list-group">
                    {this.state.matches.map((match, index) => {
                        if(match.status < 100) {
                            return (
                                <li key={index} className="list-group-item">
                                    <span>{match.team1.name} v/s {match.team2.name}</span>
                                    <button type='button' className='btn btn-sm btn-warning btn-detail float-right m-0' onClick={() => this.archive(index)}>
                                        Archive
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
