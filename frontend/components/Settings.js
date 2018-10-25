import {h, Component} from 'preact';

import Challonge from "./integrations/Challonge";

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
                <Challonge/>
            </div>
        );
    }
}
