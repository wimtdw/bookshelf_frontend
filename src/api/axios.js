import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development'
const myBaseUrl = isDevelopment ? process.env.REACT_APP_API_BASE_URL_LOCAL : process.env.REACT_APP_API_BASE_URL_DEPLOY

const axiosInstance = axios.create({
    baseURL: myBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;