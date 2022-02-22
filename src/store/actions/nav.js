const NS = 'NAV';

export const actionTypes = {
    CHANGE_NAV: `@${NS}/CHANGE_NAV`,
    CHANGE_LANG: `@${NS}/CHANGE_LANG`,
    CHANGE_PREV_LANG: `@${NS}/CHANGE_PREV_LANG`,
    CHANGE_LOAD: `@{NS}/CHANGE_LOAD`
};

export const changeCurrentPage = option => {
    return { type: actionTypes.CHANGE_NAV, payload: option };
};
