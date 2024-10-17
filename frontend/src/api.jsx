
  import axios from 'axios';
  // require('dotenv').config();

  const api = axios.create({
    baseURL: `${import.meta.VITE_APP_BACKEND_URL}`,
  });
  // const PORT=import.meta.PORT;
  // const BACKEND=import.meta.BACKEND_PORT;

  // console.log(`Running on port:${PORT}`);
  // console.log(`Running on port:${BACKEND}`);
  // Add a request interceptor to include the token in all requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  export default api;
