import {h, Component} from 'preact';
import Socket from "../../modules/socket";

export default class MatchGroups extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            groups: Socket.data.groups
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
            groups: data.groups
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div>
                <h6>Match Groups</h6>
                <br/>
                <span><strong>Here are all available match groups:</strong></span><br/>
                {this.state.groups.length < 1 ? (<span>No groups available!<br/></span>) : null}
                {this.state.groups.map((group, index) => (
                    <div key={index}>
                        <span>{group}</span><br/>
                    </div>
                ))}
                <br/>
                <span><strong>You can also create a new one:</strong></span><br/>
                <input type="text" name="group-name" id="group-name" title="group-name" className="form-control" /><br/>
                <button type="button" className="btn btn-sm btn-success btn-detail" id="submit">Create</button>
            </div>
        );
    }
}
