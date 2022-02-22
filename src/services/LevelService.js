import axios from "axios";
import authHeader from "./auth-header";
import apiUrl from "./ApiUrl";

const API_URL =  `${apiUrl}service/`;

const create = data => {
  return axios.post(API_URL + "levels", data, { headers: authHeader() });
};

const getAll = () => {
  return axios.get(API_URL + "levels", { headers: authHeader() });
};

const getById = id => {
  return axios.get(API_URL + `levels/${id}`, { headers: authHeader() });
};

const findByTitle = data => {
  return axios.post(API_URL + "levels/search", data, { headers: authHeader() });
};

const removeData = id => {
  return axios.delete(API_URL + `levels/${id}`, { headers: authHeader() });
};

// const removeAll = () => {
//   return axios.delete(API_URL + `level`, { headers: authHeader() });
// };

const update = (id, data) => {
  return axios.put(API_URL + `levels/${id}`, data, { headers: authHeader() });
};

export default {
  create,
  getAll,
  getById,
  findByTitle,
  update,
  removeData
};