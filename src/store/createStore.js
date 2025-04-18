import { createStore, combineReducers } from 'redux';
import { checkboxReducer } from '../reducers/checkboxReducer';

const createAppStore = (initialState) => {
    return createStore(
        combineReducers({
            checkboxes: checkboxReducer,
        }),
        initialState
    );
};

export default createAppStore; 
