import axiosInstance from "../../axios/axiosInstance";
import { GET_CURRENT_USER, USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from "../constants/userConstants"

export const loginUser = (data) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const tokenResponse = await axiosInstance.post('/users/login/', data);
        console.log(data);
        localStorage.setItem("accessToken", tokenResponse.data.access);
        localStorage.setItem("refreshToken", tokenResponse.data.refresh);
        dispatch({ type: USER_LOGIN_SUCCESS });
        dispatch(getCurrentUser());
    } catch (error) {
        dispatch({ type: USER_LOGIN_FAILURE, payload: error.response?.data?.detail });
    }
}  

export const getCurrentUser = () => async (dispatch) => {
    try {
        const userResponse = await axiosInstance.get('/users/me/');
        dispatch({ type: GET_CURRENT_USER, payload: userResponse.data });
    } catch (error) {
        dispatch({ type: GET_CURRENT_USER, payload: {} });
        console.log(error);
    }
}