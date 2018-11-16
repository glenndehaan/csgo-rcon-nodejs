import createUnistore from 'unistore';
import devtools from 'unistore/devtools';

/**
 * Exports the store with the default state
 *
 * @return {any}
 */
const createStore = () => {
    const initialState = {
        apiData: false
    };

    return process.env.NODE_ENV === 'production' ?  createUnistore(initialState) : devtools(createUnistore(initialState));
};

const actions = () => {
    return {
        setApiData(state, payload) {
            return {
                apiData: payload
            };
        }
    };
};

export { actions };
export default createStore();
