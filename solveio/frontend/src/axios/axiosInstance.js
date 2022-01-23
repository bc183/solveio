import axios from "axios";
import { API_URL_DEV } from "../constants";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const axiosInstance = axios.create({
    baseURL: API_URL_DEV,
});

axiosInstance.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem("accessToken") ?? "";

    if (!accessToken) {
        return request;
    }
    request.headers.Authorization = `Bearer ${accessToken}`
    const user = jwt_decode(accessToken);
    const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;

    if (!isExpired) {
        return request;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const response = await axios.post(`${API_URL_DEV}/users/refresh-token/`, {
            refresh: refreshToken
        });
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        request.headers.Authorization = `Bearer ${response.data.access}`
    } catch (error) {
        console.log(error);
    }
    
    return request;
})

export default axiosInstance;