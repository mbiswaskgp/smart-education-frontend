import axios from "axios";
import authHeader from "./auth-header";
import apiUrl from "./ApiUrl";

const API_URL =  `${apiUrl}service/`;

const create = data => {
  return axios.post(API_URL + "tutors", data, { headers: authHeader() });
};

export default {
  create
};