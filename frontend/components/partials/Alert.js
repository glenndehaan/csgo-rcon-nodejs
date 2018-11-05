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
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                            <button type="button" className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
