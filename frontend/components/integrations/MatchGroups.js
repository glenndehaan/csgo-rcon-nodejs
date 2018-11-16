import {h, Component} from 'preact';
import { connect } from "unistore/preact";

import Socket from "../../modules/socket";

class MatchGroups extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.fields = {
            group: null
        };
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
                {this.props.groups.length < 1 ? (<span>No groups available!<br/></span>) : null}
                <ul className="list-group">
                    {this.props.groups.map((group, index) => (
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

/**
 * Connect the store to the component
 */
export default connect('groups')(MatchGroups)
