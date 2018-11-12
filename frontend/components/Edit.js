import {h, Component} from 'preact';
import { route } from 'preact-router';

import Socket from "../modules/socket";
import {getIsoCodes} from '../utils/Strings';
import {findByIdInObjectArray} from "../utils/Arrays";

export default class Edit extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches,
            groups: Socket.data.groups,
            configs: Socket.data.configs,
            map: "",
            match: false
        };

        this.fields = {
            team1: {
                name: null,
                country: null
            },
            team2: {
                name: null,
                country: null
            },
            match_group: null,
            server: null,
            map: null,
            main_config: null,
            knife_config: null
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        Socket.on("update", (data) => this.onUpdate(data));

        const match = findByIdInObjectArray(Socket.data.matches, this.props.id);

        this.setState({
            match: match,
            map: match.map
        });

        if(this.state.match === false) {
            window.events.emit("notification", {
                title: "Match not found!",
                color: "danger"
            });

            route('/');
        }

        if(this.state.match.status > 0) {
            window.events.emit("notification", {
                title: "You can't edit a match that is already started!",
                color: "warning"
            });

            route('/');
        }

        console.log('this.state.match', this.state.match);
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
        this.setState({
            servers: data.servers,
            matches: data.matches,
            configs: data.configs,
            groups: data.groups
        });
    }

    /**
     * Updated the map based on the selected server
     */
    updateMapField() {
        for(let item = 0; item < this.state.servers.length; item++) {
            if(this.fields.server.value === (this.state.servers[item].ip + ":" + this.state.servers[item].port)) {
                this.setState({
                    map: this.state.servers[item].default_map
                });

                break;
            }
        }
    }

    /**
     * Check's the fields and creates the match
     */
    createMatch() {
        if(!this.checkFields()) {
            Socket.send("match_edit", {
                id: this.state.match.id,
                team1: {
                    name: this.fields.team1.name.value,
                    country: this.fields.team1.country.value
                },
                team2: {
                    name: this.fields.team2.name.value,
                    country: this.fields.team2.country.value
                },
                match_group: this.fields.match_group.value,
                map: this.fields.map.value,
                knife_config: this.fields.knife_config.value,
                match_config: this.fields.main_config.value,
                server: this.fields.server.value,
                status: 0
            });

            this.fields.team1.name.value = "";
            this.fields.team1.country.selectedIndex = 0;
            this.fields.team2.name.value = "";
            this.fields.team2.country.selectedIndex = 0;
            this.fields.match_group.selectedIndex = 0;
            this.fields.server.selectedIndex = 0;
            this.fields.map.value = "";
            this.fields.knife_config.selectedIndex = 0;
            this.fields.main_config.selectedIndex = 0;

            window.events.emit("notification", {
                title: "Match saved!",
                color: "success"
            });

            route('/');
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
        this.fields.team1.name.classList.remove("error");
        this.fields.team1.country.classList.remove("error");
        this.fields.team2.name.classList.remove("error");
        this.fields.team2.country.classList.remove("error");
        this.fields.match_group.classList.remove("error");
        this.fields.server.classList.remove("error");
        this.fields.map.classList.remove("error");
        this.fields.knife_config.classList.remove("error");
        this.fields.main_config.classList.remove("error");

        if(this.fields.team1.name.value === "") {
            errors = true;
            this.fields.team1.name.classList.add("error");
        }
        if(this.fields.team1.country.value === "false" || this.fields.team1.country.value === false) {
            errors = true;
            this.fields.team1.country.classList.add("error");
        }
        if(this.fields.team2.name.value === "") {
            errors = true;
            this.fields.team2.name.classList.add("error");
        }
        if(this.fields.team2.country.value === "false" || this.fields.team2.country.value === false) {
            errors = true;
            this.fields.team2.country.classList.add("error");
        }
        if(this.fields.match_group.value === "false" || this.fields.match_group.value === false) {
            errors = true;
            this.fields.match_group.classList.add("error");
        }
        if(this.fields.server.value === "false" || this.fields.server.value === false) {
            errors = true;
            this.fields.server.classList.add("error");
        }
        if(this.fields.map.value === "") {
            errors = true;
            this.fields.map.classList.add("error");
        }
        if(this.fields.knife_config.value === "false" || this.fields.knife_config.value === false) {
            errors = true;
            this.fields.knife_config.classList.add("error");
        }
        if(this.fields.main_config.value === "false" || this.fields.main_config.value === false) {
            errors = true;
            this.fields.main_config.classList.add("error");
        }

        return errors;
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        if(this.state.match) {
            return (
                <div className="starter-template">
                    <h3>Edit match {this.state.match.team1.name} v/s {this.state.match.team2.name}</h3>

                    <div className="table-responsive">
                        <form>
                            <h4>Team 1</h4>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td><input type="text" name="team-name-1" id="team-name-1" title="team-name-1" className="form-control" ref={c => this.fields.team1.name = c} value={this.state.match.team1.name} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td>Country Code</td>
                                        <td>
                                            <select name="team-country-1" id="team-country-1" title="team-country-1" className="form-control" ref={c => this.fields.team1.country = c}>
                                                {getIsoCodes().map((code, index) => (
                                                    <option key={index} value={code.code} selected={code.code === this.state.match.team1.country}>{code.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4>Team 2</h4>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td><input type="text" name="team-name-2" id="team-name-2" title="team-name-2" className="form-control" ref={c => this.fields.team2.name = c} value={this.state.match.team2.name} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td>Country Code</td>
                                        <td>
                                            <select name="team-country-2" id="team-country-2" title="team-country-2" className="form-control" ref={c => this.fields.team2.country = c}>
                                                {getIsoCodes().map((code, index) => (
                                                    <option key={index} value={code.code} selected={code.code === this.state.match.team2.country}>{code.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h4>General Match Settings</h4>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Match Group</td>
                                        <td>
                                            <select title="match-group" name="match-group" id="match-group" className="form-control" ref={c => this.fields.match_group = c}>
                                                {this.state.groups.map((group, index) => (
                                                    <option key={index} value={group} selected={group === this.state.match.match_group}>{group}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Server</td>
                                        <td>
                                            <select title="server" name="server" id="server" className="form-control" onChange={() => this.updateMapField()} ref={c => this.fields.server = c}>
                                                {this.state.servers.map((server, index) => (
                                                    <option key={index} value={`${server.ip}:${server.port}`} selected={`${server.ip}:${server.port}` === this.state.match.server}>{`${server.ip}:${server.port}`}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Default Server Map</td>
                                        <td><input type="text" name="map" title="map" id="map" className="form-control" value={this.state.map} ref={c => this.fields.map = c} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td>CSGO Knife Config</td>
                                        <td>
                                            <select title="csgo-knife-config" name="csgo-knife-config" id="csgo-knife-config" className="form-control" ref={c => this.fields.knife_config = c}>
                                                {this.state.configs.knife.map((config, index) => (
                                                    <option key={index} value={config} selected={config === this.state.match.knife_config}>{config}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CSGO Main Config</td>
                                        <td>
                                            <select title="csgo-main-config" name="csgo-main-config" id="csgo-main-config" className="form-control" ref={c => this.fields.main_config = c}>
                                                {this.state.configs.main.map((config, index) => (
                                                    <option key={index} value={config} selected={config === this.state.match.match_config}>{config}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <button type="button" className="btn btn-lg btn-success" id="submit" onClick={() => this.createMatch()}>Save</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            );
        }
    }
}
