import {h, Component} from 'preact';

import Socket from "../../modules/socket";
import {route} from "preact-router";

export default class Challonge extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.fields = {
            tournament: null,
            server: null,
            knife_config: null,
            main_config: null,
            match_group: null
        };
    }

    /**
     * Checks if all fields are correct
     *
     * @return {boolean}
     */
    checkFields() {
        let errors = false;

        // Reset checks
        this.fields.tournament.classList.remove("error");
        this.fields.knife_config.classList.remove("error");
        this.fields.main_config.classList.remove("error");
        this.fields.server.classList.remove("error");
        this.fields.match_group.classList.remove("error");

        if(this.fields.tournament.value === "false" || this.fields.tournament.value === false) {
            errors = true;
            this.fields.tournament.classList.add("error");
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
            console.log('test', {
                knife_config: this.fields.knife_config.value,
                match_config: this.fields.main_config.value,
                server: this.fields.server.value,
                tournament: this.fields.tournament.value,
                match_group: this.fields.match_group.value
            });

            Socket.send("integrations_challonge_import", {
                knife_config: this.fields.knife_config.value,
                match_config: this.fields.main_config.value,
                server: this.fields.server.value,
                tournament: this.fields.tournament.value,
                match_group: this.fields.match_group.value
            });

            this.fields.tournament.selectedIndex = 0;
            this.fields.server.selectedIndex = 0;
            this.fields.knife_config.selectedIndex = 0;
            this.fields.main_config.selectedIndex = 0;
            this.fields.match_group.selectedIndex = 0;

            window.events.emit("notification", {
                title: "Challonge import started...",
                color: "primary"
            });

            route('/');
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div>
                <h6>Challonge</h6>
                <span>To import the challonge matches to the database select the options below and click: Import</span><br/>
                <br/>
                <strong>Tournament</strong>
                <select name="tournament" id="tournament" title="tournament" className="form-control" ref={c => this.fields.tournament = c}>
                    <option selected disabled value="false">Select tournament</option>
                    {Socket.data.challonge.map((tournament, index) => (
                        <option key={index} value={tournament.tournament.url}>{tournament.tournament.name} ({tournament.tournament.url})</option>
                    ))}
                </select>
                <strong>Match Group</strong>
                <select name="match-group" id="match-group" title="match-group" className="form-control" ref={c => this.fields.match_group = c}>
                    <option selected disabled value="false">Select a group</option>
                    {Socket.data.groups.map((group, index) => (
                        <option key={index} value={group}>{group}</option>
                    ))}
                </select>
                <strong>Server</strong>
                <select title="server" name="server" id="server" className="form-control" ref={c => this.fields.server = c}>
                    <option selected disabled value="false">Select a server</option>
                    <option value="next">Autoselect next available server</option>
                    {Socket.data.servers.map((server, index) => (
                        <option key={index} value={`${server.ip}:${server.port}`}>{`${server.ip}:${server.port}`}</option>
                    ))}
                </select>
                <strong>CSGO Knife Config</strong>
                <select title="csgo-knife-config" name="csgo-knife-config" id="csgo-knife-config" className="form-control" ref={c => this.fields.knife_config = c}>
                    <option selected disabled value="false">Select a config</option>
                    {Socket.data.configs.knife.map((config, index) => (
                        <option key={index} value={config}>{config}</option>
                    ))}
                </select>
                <strong>CSGO Main Config</strong>
                <select title="csgo-main-config" name="csgo-main-config" id="csgo-main-config" className="form-control" ref={c => this.fields.main_config = c}>
                    <option selected disabled value="false">Select a config</option>
                    {Socket.data.configs.main.map((config, index) => (
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
