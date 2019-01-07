import {h, Component} from 'preact';

import Challonge from "./integrations/Challonge";
import Csv from "./integrations/Csv";
import Archive from "./integrations/Archive";
import MatchGroups from "./integrations/MatchGroups";
import ForceArchive from "./integrations/ForceArchive";
import {connect} from "unistore/preact";

class Settings extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.updateGeneralPageData();
    }

    /**
     * Runs when the component updates
     */
    componentDidUpdate() {
        this.updateGeneralPageData();
    }

    /**
     * Updates some general page data
     */
    updateGeneralPageData() {
        document.title = `${this.props.lang.settings.title} | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": this.props.lang.home.title,
                "url": "/"
            },
            {
                "name": this.props.lang.settings.title,
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
                <h3>{this.props.lang.settings.subtitle}</h3>
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

/**
 * Connect the store to the component
 */
export default connect('lang')(Settings);
