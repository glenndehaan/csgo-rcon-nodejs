import {h, Component} from 'preact';
import {connect} from "unistore/preact";

class Alert extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{display: 'block'}}>
                <div id="overlay"/>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.no}>{this.props.lang.general.alert.no}</button>
                            <button type="button" className="btn btn-primary" onClick={this.props.yes}>{this.props.lang.general.alert.yes}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('lang')(Alert);
