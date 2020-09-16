import axios from 'axios';

const url = "http://127.0.0.1:8888/api/private/v1/"
const info = axios.create({
    baseURL: url,
    timeout: 20000,
})

info.interceptors.request.use(function (config) {
    const took = window.sessionStorage.getItem("took")

    if (took) {
        config.headers.Authorization = took
    }
    return config
}, function (error) {


    return Promise.reject(error);
})

export default info