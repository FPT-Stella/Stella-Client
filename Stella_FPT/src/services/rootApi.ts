import axios from 'axios';

const rootApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default rootApi;
