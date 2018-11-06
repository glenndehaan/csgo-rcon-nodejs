import {h, Component} from 'preact';

export default class Alert extends Component {
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
                            <button type="button" className="btn btn-secondary" onClick={this.props.no}>No</button>
                            <button type="button" className="btn btn-primary" onClick={this.props.yes}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
