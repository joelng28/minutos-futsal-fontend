import axios from 'axios';
import { API_URL, API_TOKEN } from '../config'

const token = API_TOKEN; // o desde un contexto

const instance = axios.create({
  baseURL: API_URL, // ajusta si es necesario
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export default instance;