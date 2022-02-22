import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
} from "./types";

import AuthService from "../../services/auth.service";
import { toast } from 'react-toastify';
export const login = (email, password) => (dispatch) => {
    return AuthService.login(email, password).then(
    (data) => {
        console.log('success');
        console.log(data);
        if(data.success){
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data.data.authData },
            });
            return Promise.resolve();
        }else{
            const message = data.message
            
            toast.error(message,{autoClose: true});           
            
            dispatch({
                type: LOGIN_FAIL,
            });
    
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }     
    },
    (error) => {
        console.log('error');
        console.log(error);
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString();
        toast.error(message,{autoClose: true});    
        dispatch({
            type: LOGIN_FAIL,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });

        return Promise.reject();
     });
};
  
export const logout = () => (dispatch) => {
    AuthService.logout();

    dispatch({
        type: LOGOUT,
    });
};
  