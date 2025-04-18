import { CHECKBOX_CLICK } from '../actions/actionTypes';

const initialState = {};

export const checkboxReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHECKBOX_CLICK:
            if (action.payload) {
                return { ...state, [action.payload]: !state[action.payload] };
            }
            return state;
        default:
            return state;
    }
};
