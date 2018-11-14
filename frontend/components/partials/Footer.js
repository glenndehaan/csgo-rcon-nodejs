import {h, Component} from 'preact';

export default class Footer extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <span className="text-muted">Place footer here</span>
                </div>
            </footer>
        );
    }
}
