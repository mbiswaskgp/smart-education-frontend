import axios from "axios";
import authHeader from "./auth-header";
import apiUrl from "./ApiUrl";
const API_URL =  `${apiUrl}service/`;

const create = data => {
  return axios.post(API_URL + "subject/add", data, { headers: authHeader() });
};

const getAll = () => {
  return axios.get(API_URL + "subjects", { headers: authHeader() });
};

const getById = id => {
  return axios.get(API_URL + `subjects/${id}`, { headers: authHeader() });
};

const findByTitle = data => {
  return axios.post(API_URL + "subjects", data, { headers: authHeader() });
};

const remove = id => {
  return axios.get(API_URL + `subjects/delete/${id}`, { headers: authHeader() });
};

const removeAll = () => {
  return axios.delete(API_URL + `subjects`, { headers: authHeader() });
};

const update = (id, data) => {
  return axios.post(API_URL + `subjects/${id}`, data, { headers: authHeader() });
};

export default {
  create,
  getAll,
  getById,
  findByTitle,
  update,
  remove,
  removeAll
};