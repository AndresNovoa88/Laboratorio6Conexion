import axios from "axios";

const iAxios = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

iAxios.interceptors.request.use(
    config => {
        if (config.data && config.data.acceptance !== "false") {
            config.headers['Autorizacion'] = "Autorizo";
        } else {
            config.headers['Autorizacion'] = "No Autorizo";
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

iAxios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export { iAxios };
