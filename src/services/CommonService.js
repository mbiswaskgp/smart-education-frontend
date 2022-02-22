import axios from "axios";
import authHeader from "./auth-header";
import authImageHeader from "./auth-image-header";
import apiUrl from "./ApiUrl";

const ONLY_API_URL =  `${apiUrl}`;
const API_URL =  `${apiUrl}service/`;

const create = (url,data) => {
  return axios.post(API_URL + url, data, { headers: authHeader() });
};
const getAll = (url) => {
  return axios.get(API_URL + url, { headers: authHeader() });
};

const getAllWithPage = (url,data) => {
  return axios.post(API_URL + url , data,  { headers: authHeader() });
};

const getAllWithData = (url,data) => {
  return axios.post(API_URL + url , data,  { headers: authHeader() });
};

const findByTitle = (url, data) => {
  return axios.post(API_URL + url, data, { headers: authHeader() });
};
const getById = (url,id) => {
  return axios.get(API_URL + `${url}/${id}`, { headers: authHeader() });
};
const getBlobById = (url,id) => {
  return axios.get(API_URL + `${url}/${id}`, { headers: authHeader(), responseType: 'blob' });
};

const getData = (url) => {
  return axios.get(API_URL + `${url}`, { headers: authHeader() });
};

const update = (url, id, data) => {
  return axios.put(API_URL + `${url}/${id}`, data, { headers: authHeader() });
};

const updatePost = (url, id, data) => {
  return axios.post(API_URL + `${url}/${id}`, data, { headers: authHeader() });
};

const updatePostImage = (url, id, data) => {
  console.log(id);
  if(id!=""){
    return axios.post(API_URL + `${url}/${id}`, data, { headers: authImageHeader() });
  }else{
    return axios.post(API_URL + `${url}/`, data, { headers: authImageHeader() });
  }  
};

const remove = (url,id) => {
  return axios.get(API_URL + `${url}/${id}`, { headers: authHeader() });
};

const deleteData = (url,id) => {
  return axios.delete(API_URL + `${url}/${id}`, { headers: authHeader() });
};

const deleteObj = (url,data) => {
  return axios.post(API_URL + url, data, { headers: authHeader() });
};

const postData = (url,data) => {
  return axios.post(ONLY_API_URL + url, data);
};

export default {
  create,
  getAll,
  getData,
  getBlobById,
  getAllWithPage,
  getAllWithData,
  findByTitle,
  getById,
  update,
  updatePost,
  updatePostImage,
  remove,
  deleteData,
  deleteObj,
  postData
};