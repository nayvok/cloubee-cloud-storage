import axios from 'axios';

import { APP_ROUTES } from '@/libs/constants/routes';

const options = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const { data, status } = error.response;
        if (status === 401) {
            window.location.href = APP_ROUTES.LOGIN;
        }
        return Promise.reject(new Error(...data));
    },
);

export default API;
