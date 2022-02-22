import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import nav from "./nav";


export default combineReducers({
    auth,
    message,
    nav
});