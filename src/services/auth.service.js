import axios from "axios";
import authHeader from "./auth-header";
//const API_URL = "https://api.crefft.uk/api/auth/"; //live
//const API_URL = "http://localhost:8000/api/auth/";   //local

import apiUrl from "./ApiUrl";

const API_URL =  `${apiUrl}auth/`;

class AuthService {
    login(email, password) {
        return axios
        .post(API_URL + "signin", { email, password })
        .then((response) => {
            console.log(response.data);

            // if (response.data.accessToken) {
            //     localStorage.setItem("user", JSON.stringify(response.data));
            // }
            // return response.data;
            if(response.data.success){
                if (response.data.data.authData.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data.data.authData));
                }
            }
                return response.data;
                 
        });
    }
    logout() {

        axios
        .get(API_URL + "logout", { headers: authHeader() })
        .then((response) => {
            if(response.data.success){
                localStorage.removeItem("user");
                console.log(response.data);
            }
              
        });
    }    
}

export default new AuthService();