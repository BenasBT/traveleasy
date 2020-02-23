import axios from 'axios';
import { API_BASE_URL} from '../constants';

const apiClient = axios.create({
  // baseURL: process.env.REACT_APP_BE_BASE_URL,
  baseURL:  API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

});

export default apiClient;
