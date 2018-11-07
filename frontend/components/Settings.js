import {h, Component} from 'preact';

import Challonge from "./integrations/Challonge";
import Archive from "./integrations/Archive";
import MatchGroups from "./integrations/MatchGroups";

export default class Settings extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Settings</h3>
                <hr/>
                <MatchGroups/>
                <hr/>
                <Challonge/>
                <hr/>
                <Archive/>
            </div>
        );
    }
}
