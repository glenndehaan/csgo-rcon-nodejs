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

        this.fields = {
            group: null
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
     * Creates a new match group
     */
    createMatchGroup() {
        if(!this.checkFields()) {
            Socket.send("group_create", {
                group: this.fields.group.value
            });

            this.fields.group.value = "";

            window.events.emit("notification", {
                title: "Group created!",
                color: "success"
            });
        }
    }

    /**
     * Checks if all fields are correct
     *
     * @return {boolean}
     */
    checkFields() {
        let errors = false;

        // Reset checks
        this.fields.group.classList.remove("error");

        if(this.fields.group.value === "") {
            errors = true;
            this.fields.group.classList.add("error");
        }

        return errors;
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
                <ul className="list-group">
                    {this.state.groups.map((group, index) => (
                        <li key={index} className="list-group-item">{group}</li>
                    ))}
                </ul>
                <br/>
                <span><strong>You can also create a new one:</strong></span><br/>
                <input type="text" name="group-name" id="group-name" title="group-name" className="form-control" ref={c => this.fields.group = c} /><br/>
                <button type="button" className="btn btn-sm btn-success btn-detail" id="submit" onClick={() => this.createMatchGroup()}>Create</button>
            </div>
        );
    }
}
