import {h, Component} from 'preact';

import Challonge from "./integrations/Challonge";
import Csv from "./integrations/Csv";
import Archive from "./integrations/Archive";
import MatchGroups from "./integrations/MatchGroups";
import ForceArchive from "./integrations/ForceArchive";

export default class Settings extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `Settings | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "name": "Settings",
                "url": false
            }
        ]);
    }

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
                <Csv/>
                <hr/>
                <Archive/>
                <hr/>
                <ForceArchive/>
            </div>
        );
    }
}
