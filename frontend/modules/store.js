import createUnistore from 'unistore';
import devtools from 'unistore/devtools';

/**
 * Exports the store with the default state
 *
 * @return {any}
 */
const createStore = () => {
    const initialState = {
        servers: [],
        groups: [],
        matches: [],
        maps: [],
        configs: {},
        challonge: [],
        logs: []
    };

    return process.env.NODE_ENV === 'production' ?  createUnistore(initialState) : devtools(createUnistore(initialState));
};

/**
 * All action for mutating the store
 *
 * @return {*}
 */
const actions = () => {
    return {
        setSocketData(state, payload) {
            return {
                servers: payload.servers,
                groups: payload.groups,
                matches: payload.matches,
                maps: payload.maps,
                configs: payload.configs,
                challonge: payload.challonge
            };
        },
        setLogData(state, payload) {
            return {
                logs: payload.logs
            };
        }
    };
};

export { actions };
export default createStore();
