import {h, Component} from 'preact';
import { Link } from 'preact-router/match';

export default class Breadcrumbs extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            breadcrumbs: []
        };

        window.events.on('breadcrumbs', (e) => this.update(e));
    }

    /**
     * Updates the breadcrumbs
     *
     * @param breadcrumbs
     */
    update(breadcrumbs) {
        this.setState({
            breadcrumbs
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {this.state.breadcrumbs.map((breadcrumb, index) => (
                        <li key={index} className={`breadcrumb-item ${!breadcrumb.url ? 'active' : ''}`} aria-current="page">
                            {breadcrumb.url ? <Link href={breadcrumb.url}>{breadcrumb.name}</Link> : breadcrumb.name}
                        </li>
                    ))}
                </ol>
            </nav>
        );
    }
}
