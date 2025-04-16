import { AGREE_TO_TERMS, REVOKE_AGREEMENT } from './actions';

const initialState = {
    agreed: localStorage.getItem('agreementAccepted') === 'true',
};

const agreementReducer = (state = initialState, action) => {
    switch (action.type) {
        case AGREE_TO_TERMS:
            localStorage.setItem('agreementAccepted', action.payload.toString());
            return { ...state, agreed: action.payload };
        case REVOKE_AGREEMENT:
            localStorage.setItem('agreementAccepted', 'false');
            return { ...state, agreed: false };
        default:
            return state;
    }
};

export default agreementReducer;