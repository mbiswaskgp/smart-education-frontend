import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from "../actions/types";
  
  const user = JSON.parse(localStorage.getItem("user"));

  const initialState = user
    ? { isLoggedIn: true, userRoleData:user.user.role_id, user }
    : { isLoggedIn: false, userRoleData:null, user: null, };
  
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userRoleData: payload.user.user.role_id,
                user: payload.user,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userRoleData: false,
                user: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userRoleData: false,
                user: null,
            };
        default:
            return state;
    }
}