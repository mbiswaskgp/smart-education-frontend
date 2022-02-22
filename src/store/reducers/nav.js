import { actionTypes } from '../actions/nav';

const NavState = {
    currentNav: '',
};

const reducer = (state = NavState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHANGE_NAV:
            return {
                ...state,
                currentNav: payload
            };       
        default:
            return state;
    }
};

export default reducer;
