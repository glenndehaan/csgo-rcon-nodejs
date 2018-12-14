import {h, Component} from 'preact';
import { connect } from "unistore/preact";

// import Socket from "../../modules/socket";
import {route} from "preact-router";

import csvtojson from "csvtojson";

class Csv extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.fields = {
            csv: null,
            server: null,
            knife_config: null,
            main_config: null,
            match_group: null
        };

        this.fileContents = [];
    }

    /**
     * Checks if all fields are correct
     *
     * @return {boolean}
     */
    checkFields() {
        let errors = false;

        // Reset checks
        this.fields.csv.classList.remove("error");
        this.fields.knife_config.classList.remove("error");
        this.fields.main_config.classList.remove("error");
        this.fields.server.classList.remove("error");
        this.fields.match_group.classList.remove("error");

        if(this.fileContents.length < 1) {
            errors = true;
            this.fields.csv.classList.add("error");
        }
        if(this.fields.server.value === "false" || this.fields.server.value === false) {
            errors = true;
            this.fields.server.classList.add("error");
        }
        if(this.fields.knife_config.value === "false" || this.fields.knife_config.value === false) {
            errors = true;
            this.fields.knife_config.classList.add("error");
        }
        if(this.fields.main_config.value === "false" || this.fields.main_config.value === false) {
            errors = true;
            this.fields.main_config.classList.add("error");
        }
        if(this.fields.match_group.value === "false" || this.fields.match_group.value === false) {
            errors = true;
            this.fields.match_group.classList.add("error");
        }

        return errors;
    }

    /**
     * Send the request to the socket to start importing the challonge matches
     */
    importTournament() {
        if(!this.checkFields()) {
            // Socket.send("integrations_challonge_import", {
            //     knife_config: this.fields.knife_config.value,
            //     match_config: this.fields.main_config.value,
            //     server: this.fields.server.value,
            //     tournament: this.fields.tournament.value,
            //     match_group: this.fields.match_group.value
            // });

            this.fields.server.selectedIndex = 0;
            this.fields.knife_config.selectedIndex = 0;
            this.fields.main_config.selectedIndex = 0;
            this.fields.match_group.selectedIndex = 0;

            window.events.emit("notification", {
                title: "CSV import started...",
                color: "primary"
            });

            route('/');
        }
    }

    /**
     * Check's if a file is uploaded correctly
     *
     * @param e
     */
    handleFileChange(e) {
        let reader = new FileReader();

        reader.onload = event => {
            csvtojson()
                .fromString(event.target.result)
                .then((result) => {
                    this.fileContents = result;
                })
        };

        reader.readAsText(e.target.files[0]);
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div>
                <h6>CSV</h6>
                <span>To import a CSV upload you CSV below and click: Import</span><br/>
                <br/>
                <strong>CSV</strong>
                <input type="file" className="form-control-file" name="csv" id="csv" title="csv" accept="text/csv" ref={c => this.fields.csv = c} onChange={(e) => this.handleFileChange(e)} />
                <strong>Match Group</strong>
                <select name="match-group" id="match-group" title="match-group" className="form-control" ref={c => this.fields.match_group = c}>
                    <option selected disabled value="false">Select a group</option>
                    {this.props.groups.map((group, index) => (
                        <option key={index} value={group}>{group}</option>
                    ))}
                </select>
                <strong>Server</strong>
                <select title="server" name="server" id="server" className="form-control" ref={c => this.fields.server = c}>
                    <option selected disabled value="false">Select a server</option>
                    <option value="next">Autoselect next available server</option>
                    {this.props.servers.map((server, index) => (
                        <option key={index} value={`${server.ip}:${server.port}`}>{`${server.ip}:${server.port}`}</option>
                    ))}
                </select>
                <strong>CSGO Knife Config</strong>
                <select title="csgo-knife-config" name="csgo-knife-config" id="csgo-knife-config" className="form-control" ref={c => this.fields.knife_config = c}>
                    <option selected disabled value="false">Select a config</option>
                    {this.props.configs.knife.map((config, index) => (
                        <option key={index} value={config}>{config}</option>
                    ))}
                </select>
                <strong>CSGO Main Config</strong>
                <select title="csgo-main-config" name="csgo-main-config" id="csgo-main-config" className="form-control" ref={c => this.fields.main_config = c}>
                    <option selected disabled value="false">Select a config</option>
                    {this.props.configs.main.map((config, index) => (
                        <option key={index} value={config}>{config}</option>
                    ))}
                </select><br/>
                <button type='button' className='btn btn-sm btn-primary btn-detail' onClick={() => this.importTournament()}>
                    Import
                </button>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('groups,servers,configs')(Csv);
