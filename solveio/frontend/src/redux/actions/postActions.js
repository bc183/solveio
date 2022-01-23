import axiosInstance from "../../axios/axiosInstance";
import { CREATE_POST_REQUEST, CREATE_POST_SUCCESS, GET_POST_REQUEST, GET_POST_SUCCESS } from "../constants/postConstants"

export const createPost = (data) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_POST_REQUEST });
        const response = await axiosInstance.post("/posts/", data);
        dispatch({ type: CREATE_POST_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);
    }
}

export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_POST_REQUEST });
        const response = await axiosInstance.get(`/posts/${id}/`);
        dispatch({ type: GET_POST_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);
    }
} 