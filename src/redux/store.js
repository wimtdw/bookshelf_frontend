import { createStore, combineReducers } from 'redux';
import agreementReducer from './reducers';

const rootReducer = combineReducers({
    agreement: agreementReducer,
});

const store = createStore(rootReducer);

export default store;